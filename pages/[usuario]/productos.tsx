import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { RiAddCircleLine, RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/ri';

import {
  deleteDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  documentRef,
  productsCollection,
  storage,
} from '../../lib/firebase';
import { Product } from '../../lib/types';
import AuthCheck from '../../components/AuthCheck';
import toast from 'react-hot-toast';
import { useUserContext } from '../../context/userContext';
import Image from 'next/image';
import { deleteObject, ref } from 'firebase/storage';

const MyProdcuts: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useUserContext();

  useEffect(() => {
    const productsQuery = query(
      productsCollection,
      where('seller', '==', `${user?.uid}`)
    );
    const unsuscribe = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map((product) => product.data()));
    });
    return unsuscribe;
  }, [user]);

  return (
    <AuthCheck>
      <main>
        <h1 className="page-title">Mis productos</h1>
        <Link href="/usuario/nuevo-producto">
          <a className="flex items-center justify-center space-x-2 primary-btn w-1/5">
            <RiAddCircleLine className="icon" />
            <p>Agregar Producto</p>
          </a>
        </Link>
        {products.length > 0 ? (
          <table className="w-full mt-6 space-y-5 table-fixed ">
            <thead>
              <tr className="text-lg text-gray-700">
                <th>Producto</th>
                <th>Eliminar</th>
                <th>Editar</th>
                <th>Publicar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <MyProduct key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay productos</p>
        )}
      </main>
    </AuthCheck>
  );
};

type MyProdcutProps = {
  product: Product;
};

const MyProduct = ({ product }: MyProdcutProps) => {
  const router = useRouter();
  const deleteProduct = (product: Product) => {
    const productRef = documentRef(`${productsCollection.path}/${product.id}`);
    deleteDoc(productRef);
    product.images.map((image) => {
      const imageRef = ref(
        storage,
        `uploads/${auth.currentUser?.uid}/${image.imgName}`
      );
      deleteObject(imageRef)
        .then(() => {})
        .catch((e) => console.log(e));
    });
    toast.success('Producto Eliminado');
  };

  const updatePublication = async (product: Product) => {
    const productRef = documentRef(`${productsCollection.path}/${product.id}`);
    await updateDoc(productRef, {
      published: !product.published,
    });
    toast.success(
      `${product.published ? 'Producto no publicado' : 'Producto publicado'}`
    );
  };
  return (
    <tr className="mb-28">
      <td>
        <Image
          src={product.images[0].imgUrl}
          alt={product.images[0].imgName}
          width={120}
          height={120}
        />
      </td>
      <td>
        <button className="btn" onClick={() => deleteProduct(product)}>
          <RiDeleteBin2Fill className="text-red-600 icon" />
        </button>
      </td>
      <td>
        <button
          className="btn"
          onClick={() => router.push(`/${auth.currentUser?.uid}/${product.id}`)}
        >
          <RiEdit2Fill className="text-green-600 icon" />
        </button>
      </td>
      <td>
        <button>
          <input
            type="checkbox"
            name="publish"
            id="publish"
            checked={product.published}
            onChange={() => updatePublication(product)}
          />
        </button>
      </td>
    </tr>
  );
};

export default MyProdcuts;
