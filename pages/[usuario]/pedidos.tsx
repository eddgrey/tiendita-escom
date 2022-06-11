import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Buyout from '../../components/Buyout';
import { auth, collectionRef } from '../../lib/firebase';
import { Order } from '../../lib/types';

const Pedidos: NextPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ordersRef = collectionRef<Order>(
      `users/${auth.currentUser?.uid}/orders`
    );

    const ordersQuery = query(ordersRef, orderBy('date', 'desc'));

    const unsuscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      setOrders(querySnapshot.docs.map((order) => order.data()));
    });

    return unsuscribe;
  }, []);

  return (
    <main>
      <h1 className="page-title">Mis pedidos</h1>
      <section>
        {orders.map((order) => (
          <Buyout
            key={order.date.toMillis()}
            buyout={order}
            userType="seller"
          />
        ))}
      </section>
    </main>
  );
};

export default Pedidos;
