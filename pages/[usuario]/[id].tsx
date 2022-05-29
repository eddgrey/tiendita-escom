import { addDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUploader from '../../components/ImageUploader';
import { auth, documentRef, productsCollection } from '../../lib/firebase';
import { Category, ImageProduct, Product } from '../../lib/types';

export const getStaticProps: GetStaticProps = async (context) => {
  let product = defaultProductValues;

  const productId = context.params?.id;

  if (typeof productId === 'string') {
    const productQuery = query(
      productsCollection,
      where('id', '==', productId)
    );
    const productValues = (await getDocs(productQuery)).docs[0];

    if (productValues) {
      product = productValues.data();
    }
  }
  return {
    props: { product },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getDocs(productsCollection)).docs.map((product) => {
    const { id, seller } = product.data();
    return { params: { id, usuario: seller } };
  });
  return { paths, fallback: 'blocking' };
};

const defaultProductValues = {
  id: '',
  seller: '',
  name: '',
  description: '',
  category: Category.comida,
  price: 0,
  stock: 0,
  numReviews: 0,
  totalScore: 0,
  images: [],
  soldUnits: 0,
  published: false,
} as Product;

type Props = {
  product: Product;
};

const ProductForm: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const isNewProduct = router.query.id === 'nuevo-producto' ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({ defaultValues: product });

  const [images, setImages] = useState<ImageProduct[]>(product.images);

  const onSubmit: SubmitHandler<Product> = async (product) => {
    if (isNewProduct) {
      await addNewProduct(product);
    } else {
      await updateProduct(product);
    }
  };

  const addNewProduct = async (product: Product) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const newProduct = await addDoc(productsCollection, {
        ...product,
        images,
        id: '',
        seller: uid,
      });
      await updateDoc(newProduct, { id: newProduct.id });

      router.push('/usuario/productos');
      toast.success('Producto agregado!');
    }
  };

  const updateProduct = async (product: Product) => {
    const ref = documentRef(`products/${product.id}`);
    await updateDoc(ref, {
      ...product,
    });
    router.push('/usuario/productos');
    toast.success('Producto actualizado!');
  };

  return (
    <main className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-1/2 bg-white rounded-lg py-4 px-10 space-y-4"
      >
        <h1 className="self-center text-2xl font-semibold">
          {isNewProduct ? 'Nuevo Producto' : 'Editar Producto'}
        </h1>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="input"
            placeholder="Nombre"
            required
          />
        </div>
        <div>
          <label>Descripcion:</label>
          <textarea {...register('description')} className="input"></textarea>
        </div>
        <div>
          <label>Categoria:</label>
          <select {...register('category')} className="input">
            <option value="papeleria">Papeleria</option>
            <option value="comida">Comida</option>
            <option value="electronica">Electronica</option>
          </select>
        </div>
        <div className="flex space-x-10">
          <div className="w-1/2">
            <label>Precio:</label>
            <input
              type="number"
              className="input"
              {...register('price', { valueAsNumber: true, min: 1, max: 1000 })}
              required
            />
          </div>
          <div className="w-1/2">
            <label>Stock:</label>
            <input
              type="number"
              className="input"
              {...register('stock', { valueAsNumber: true, min: 1, max: 1000 })}
              required
            />
          </div>
        </div>
        <ImageUploader images={images} setImages={setImages} />

        <button type="submit" className="primary-btn w-1/2 self-center">
          {isNewProduct ? 'Agregar Producto' : 'Guardar Cambios'}
        </button>
      </form>
    </main>
  );
};

export default ProductForm;
