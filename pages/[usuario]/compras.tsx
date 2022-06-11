import { onSnapshot, orderBy, query } from 'firebase/firestore';
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

    const ordersQuery = query(ordersRef, orderBy('date', 'desc'));

    const unsuscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      setShopping(querySnapshot.docs.map((order) => order.data()));
    });

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
