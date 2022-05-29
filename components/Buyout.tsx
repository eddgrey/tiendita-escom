import { format } from 'date-fns';
import { getDoc, increment, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
import { auth, documentRef } from '../lib/firebase';
import { Order, Product } from '../lib/types';

type BuyoutProps = {
  buyout: Order;
  userType: string;
};

const Buyout = ({ buyout, userType = '' }: BuyoutProps) => {
  const { date, total, state, products, id } = buyout;
  const cancel = async (collection: string) => {
    const orderRef = documentRef<Order>(
      `/users/${auth.currentUser?.uid}/${collection}/${id}`
    );
    await updateDoc(orderRef, {
      state: 'Cancelado',
    });
    toast.error('Pedido Cancelado');
  };

  const updateStock = async (id: string, n: number) => {
    const productRef = documentRef<Product>(`products/${id}`);
    await updateDoc(productRef, {
      stock: increment(-n),
      soldUnits: increment(n),
    });
  };

  const complete = async () => {
    const orderRef = documentRef<Order>(
      `/users/${auth.currentUser?.uid}/orders/${id}`
    );
    await updateDoc(orderRef, {
      state: 'Completado',
    });

    const order = (await getDoc(orderRef)).data();
    order?.products.map((product) => {
      updateStock(product.id, product.amount);
    });

    toast.success('Pedido completado!');
  };
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 mb-4">
      <p>{format(date.toDate(), "dd MMM 'de' yyy")}</p>
      <p
        className={`${
          state === 'Pendiente'
            ? 'text-amber-600'
            : state === 'Completado'
            ? 'text-green-600'
            : 'text-red-600'
        } text-lg font-medium`}
      >
        {state}
      </p>
      {products.map((product) => (
        <div key={product.id} className="flex items-center space-x-4 mb-2">
          <Image
            src={product.image.imgUrl}
            alt={product.image.imgName}
            width={60}
            height={60}
          />
          {userType === 'seller' ? (
            state === 'Pendiente' && (
              <span className="font-semibold text-lg space-x-4">
                <button
                  className="text-red-600"
                  onClick={() => cancel('orders')}
                >
                  Cancelar
                </button>
                <button className="text-green-600" onClick={complete}>
                  Completar
                </button>
              </span>
            )
          ) : (
            <>
              <Link href={`/producto/${product.id}`}>
                <a className="text-indigo-700 font-medium">Ver producto</a>
              </Link>
              {state === 'Pendiente' && (
                <button
                  className="text-red-600"
                  onClick={() => cancel('shopping')}
                >
                  Cancelar
                </button>
              )}
              {state === 'Completado' && (
                <Link href={`/producto/${product.id}/review`}>
                  <a className="text-red-700 font-medium">Calificar</a>
                </Link>
              )}
            </>
          )}
        </div>
      ))}
      <strong>Total ${total}</strong>
    </div>
  );
};

export default Buyout;
