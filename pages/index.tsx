import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useUserContext } from '../context/userContext';
import { fetchProducts } from '../lib/fetchProducts';
import { Category, Product } from '../lib/types';

const LIMIT = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await fetchProducts();
  return {
    props: {
      products,
    },
  };
};

type PropsHome = {
  products: Product[];
};

const Home: NextPage<PropsHome> = ({ products }) => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const { filters } = useUserContext();

  useEffect(() => {
    fetchProducts(filters.category, filters.orderBy).then((products) => {
      setCurrentProducts(products);
    });
  }, [filters]);

  return (
    <main className="">
      <Head>
        <title>Tienda Escom</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl text-blue-600 mb-6">Tienda Escom</h1>
      <ProductList products={currentProducts} />
    </main>
  );
};

export default Home;

type ProductListProps = {
  products: Product[];
};

const ProductList = ({ products }: ProductListProps) => {
  return (
    <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.name} product={product} />
      ))}
    </section>
  );
};
