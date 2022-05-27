import { getDocs, onSnapshot } from 'firebase/firestore';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import AuthCheck from '../../components/AuthCheck';
import { auth, collectionRef } from '../../lib/firebase';
import { Order } from '../../lib/types';
import Buyout from '../../components/Buyout';

const Compras: NextPage = () => {
  const [shopping, setShopping] = useState<Order[]>([]);

  useEffect(() => {
    const ordersRef = collectionRef<Order>(
      `users/${auth.currentUser?.uid}/shopping`
    );

    const unsuscribe = onSnapshot(ordersRef, (orders) => {
      setShopping(orders.docs.map((order) => order.data()));
    });
    console.log(shopping);
    return unsuscribe;
  }, []);

  return (
    <AuthCheck>
      <main>
        <h1 className="page-title">Mis compras</h1>
        {shopping.map((s) => (
          <Buyout key={s.date.toString()} buyout={s} userType="" />
        ))}
      </main>
    </AuthCheck>
  );
};

export default Compras;
