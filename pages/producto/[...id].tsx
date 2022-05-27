import {
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import FormReview from '../../components/FormReview';
import ImageSlider from '../../components/ImageSlider';
import ReviewsList from '../../components/ReviewsList';
import Stars from '../../components/Stars';
import { useUserContext } from '../../context/userContext';
import {
  collectionRef,
  documentRef,
  productsCollection,
} from '../../lib/firebase';
import { Review, Product, ProductCart } from '../../lib/types';

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  let product = null;
  let reviews = null;

  if (id) {
    const productRef = documentRef<Product>(`products/${id[0]}`);
    const reviewsRef = collectionRef<Review>(`products/${id[0]}/reviews`);

    reviews = (await getDocs(reviewsRef)).docs.map((opinion) => opinion.data());
    console.log(reviews);
    product = (await getDoc(productRef)).data();
  }
  return {
    props: {
      product,
      reviews,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getDocs(productsCollection)).docs.map((product) => {
    const { id } = product.data();
    return {
      params: { id: [id] },
    };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

type ProductProps = {
  product: Product;
  reviews: Review[];
};

const ProductPage: NextPage<ProductProps> = ({ product, reviews }) => {
  const id = useRouter().query.id!;
  return (
    <main className="flex flex-col justify-center items-center">
      {id.length === 1 ? (
        <>
          <ProductInfo product={product} />
          <h3 className="text-xl text-gray-900 font-semibold my-4">
            Opiniones sobre {product.name}
          </h3>
          <ReviewsList reviews={reviews} />
        </>
      ) : (
        <FormReview product={product} />
      )}
    </main>
  );
};

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { user } = useUserContext();

  const addToCart = async () => {
    if (user) {
      const carritoRef = documentRef<ProductCart>(
        `users/${user.uid}/shopping-cart/${product.id}`
      );
      const snapshot = await getDoc(carritoRef);

      if (snapshot.exists()) {
        updateDoc(carritoRef, {
          amount: increment(1),
        });
      } else {
        await setDoc(carritoRef, {
          id: product.id,
          image: product.images[0],
          name: product.name,
          price: product.price,
          seller: product.seller,
          published: product.published,
          stock: product.stock,
          amount: 1,
        });
      }
      toast.success('Se agrego el producto');
    } else {
      toast.error('Debe iniciar sesión!');
    }
  };

  return (
    <section className="h-1/2 bg-white/90 grid grid-cols-1 md:grid-cols-3 w-full rounded-lg">
      <div className="h-full px-4 flex justify-between items-center col-span-2">
        <ImageSlider images={product.images} />
        <div className="w-1/2 self-start py-4 ml-4">
          <h2 className="text-2xl font-semibold tracking-wide text-center mb-4">
            {product.name}
          </h2>
          <p>{product.description}</p>
        </div>
      </div>
      <div className="h-full flex flex-col py-4 px-10 space-y-3">
        <Stars numStars={product.totalScore / product.numReviews} showNum />
        <strong className="text-xl">$ {product.price}</strong>
        <p>{product.stock > 0 ? 'Stock disponible' : 'Producto agotado'}</p>
        <p>{product.soldUnits} unidades vendidas</p>
        <label className="flex items-center">
          <p>Cantidad: </p>
          <select className="border-none focus:ring-0">
            <option value={1}>1</option>
          </select>
          <span className="text-gray-300">{`(${product.stock} disponibles)`}</span>
        </label>
        <a className="primary-btn w-full">Comprar</a>

        <button className="primary-btn w-full" onClick={addToCart}>
          Agregar al carrito
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
