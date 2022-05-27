import {
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NumberFormat from 'react-number-format';
import { useUserContext } from '../../context/userContext';
import { auth, collectionRef, documentRef } from '../../lib/firebase';
import { Order, Product, ProductCart, User } from '../../lib/types';

export const getStaticProps: GetStaticProps = async (context) => {
  const user = context.params?.user;

  const shoppingCartRef = collectionRef<ProductCart>(
    `users/${user}/shopping-cart`
  );

  const products = (await getDocs(shoppingCartRef)).docs.map((product) =>
    product.data()
  );

  return {
    props: {
      products,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usersRef = collectionRef<User>('users');

  const paths = (await getDocs(usersRef)).docs.map((userDoc) => {
    const user = userDoc.id;
    return {
      params: { user },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

type ShoppingCartRefProps = {
  products: ProductCart[];
};

const ShoppingCartRef: NextPage<ShoppingCartRefProps> = ({ products }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [productsCart, setProductsCart] = useState(products);

  useEffect(() => {
    const shoppingCartRef = collectionRef<ProductCart>(
      `users/${auth.currentUser?.uid}/shopping-cart`
    );
    const unsuscribe = onSnapshot(
      shoppingCartRef,
      (snapshot) => {
        const products = snapshot.docs.map((product) => product.data());
        setProductsCart(products);
      },
      (error) => console.log(error)
    );

    return unsuscribe;
  }, []);

  const updateTotalCart = () => {
    let sum = 0;
    for (const product of productsCart) {
      sum += product.price * product.amount;
    }
    return sum;
  };

  const deleteProductCart = async (productId: string) => {
    const productRef = documentRef<ProductCart>(
      `users/${auth.currentUser?.uid}/shopping-cart/${productId}`
    );
    await deleteDoc(productRef);
  };

  const createOrder = async (seller: string) => {
    const sellerRef = collectionRef<Order>(`users/${seller}/orders`);

    const p = productsCart.filter((product) => product.seller === seller);
    if (user) {
      const d = await addDoc(sellerRef, {
        id: '',
        user: user.uid,
        state: 'Pendiente',
        products: p.map((product) => {
          return {
            id: product.id,
            image: product.image,
            amount: product.amount,
          };
        }),
        date: serverTimestamp(),
        total: updateTotalCart(),
      });
      await updateDoc(d, {
        id: d.id,
      });
    }
  };

  const checkOut = async () => {
    const shopping = collectionRef<Order>(`users/${user?.uid}/shopping`);

    const d = await addDoc(shopping, {
      id: '',
      total: updateTotalCart(),
      state: 'Pendiente',
      products: productsCart.map((product) => {
        return {
          id: product.id,
          image: product.image,
          amount: product.amount,
        };
      }),
      date: serverTimestamp(),
    });

    await updateDoc(d, {
      id: d.id,
    });

    const sellers = new Set(productsCart.map((product) => product.seller));

    sellers.forEach((seller) => createOrder(seller));

    // Vaciar el carrito
    // productsCart.map((product) => deleteProductCart(product.id));

    router.push(`/usuario/compras`);
    toast.success('Pedido creado');
  };

  return (
    <main className="flex flex-col justify-between">
      <h1 className="page-title">Carrito de Compras</h1>
      {productsCart.length > 0 ? (
        <>
          <table className="w-full mt-6">
            <tr className="grid grid-cols-4 text-lg text-gray-700">
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
            {productsCart.map((product) => (
              <ProductCart
                key={product.id}
                product={product}
                setTotalCart={updateTotalCart}
              />
            ))}
          </table>
          <strong className=" self-end">
            Total
            <NumberFormat
              value={updateTotalCart()}
              displayType="text"
              prefix="$"
            />
          </strong>
          <button className="primary-btn self-center w-1/4" onClick={checkOut}>
            Comprar
          </button>
        </>
      ) : (
        <p>No hay productos en el carrito</p>
      )}
    </main>
  );
};

type Props = {
  product: ProductCart;
  setTotalCart: () => void;
};

const ProductCart = ({ product, setTotalCart }: Props) => {
  const [amount, setAmount] = useState(product.amount);

  useEffect(() => {
    setTotalCart();
  }, [amount]);

  const updateAmount = async (e: ChangeEvent<HTMLInputElement>) => {
    const productRef = documentRef<ProductCart>(
      `users/${auth.currentUser?.uid}/shopping-cart/${product.id}`
    );
    await updateDoc(productRef, {
      amount: parseInt(e.target.value),
    });
  };

  const deleteProductCart = async (productId: string) => {
    const productRef = documentRef<ProductCart>(
      `users/${auth.currentUser?.uid}/shopping-cart/${productId}`
    );
    await deleteDoc(productRef);
    toast.error('Producto eliminado!');
  };

  return (
    <tr className="grid grid-cols-4 items-center">
      <td className="flex flex-col place-self-center">
        <Image
          src={product.image.imgUrl}
          alt={product.image.imgName}
          width={120}
          height={120}
        />
        <div className="flex flex-col items-start text-sm font-medium ml-6">
          <Link href={`/producto/${product.id}`}>
            <a className="text-indigo-600">Ver producto</a>
          </Link>
          <button
            onClick={() => deleteProductCart(product.id)}
            className="text-red-600"
          >
            Eliminar producto
          </button>
        </div>
      </td>
      <td>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={product.amount}
          onChange={updateAmount}
        />
      </td>
      <td>
        <NumberFormat
          value={product.price}
          displayType="text"
          prefix="$"
          decimalSeparator="."
        />
      </td>
      <td>
        <NumberFormat
          value={product.amount * product.price}
          displayType="text"
          prefix="$"
          decimalSeparator="."
        />
      </td>
    </tr>
  );
};

export default ShoppingCartRef;
