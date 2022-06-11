import { getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { auth, documentRef, usersCollection } from '../../lib/firebase';
import { User } from '../../lib/types';

export const getStaticProps: GetStaticProps = async (context) => {
  const userId = context.params?.usuario;
  const ref = documentRef<User>(`users/${userId}`);
  const user = (await getDoc(ref)).data();
  return {
    props: {
      user,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getDocs(usersCollection)).docs.map(({ id }) => {
    return {
      params: { usuario: id },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

type UserProfileProps = {
  user: User;
};

const UserProfile: NextPage<UserProfileProps> = ({ user }) => {
  const [whatsapp, setWhatsapp] = useState(user.whatsapp);
  return (
    <main className="flex flex-col">
      <section className="flex flex-col space-y-4 items-center self-center mb-16">
        <Image
          alt="photo User"
          className="rounded-full"
          src={`${user?.photoURL}`}
          width={80}
          height={80}
        />
        <p className="font-semibold">{user?.displayName}</p>
      </section>
      <Contact user={user} admin={user.uid === auth.currentUser?.uid} />
    </main>
  );
};

type ContactProps = {
  admin: boolean;
  user: User;
};

const Contact = ({ user, admin }: ContactProps) => {
  const [whatsapp, setWhatsapp] = useState(user.whatsapp);

  const updateWhatsapp = async () => {
    const userRef = documentRef<User>(`users/${user.uid}`);
    await updateDoc(userRef, {
      whatsapp,
    });
    toast.success('Whatsapp actualizado!');
  };

  return (
    <section className=" max-w-screen-lg space-y-5">
      <h2 className="text-lg font-medium">Formas de contacto</h2>
      <span className="flex items-center space-x-5">
        <Image src="/whatsapp.png" alt="whatsapp" width={30} height={30} />
        {admin && (
          <>
            <input
              type="text"
              className="input w-1/3 lg:w-1/5"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <button onClick={updateWhatsapp}>Guardar</button>
          </>
        )}
        {!admin && <p>{whatsapp}</p>}
      </span>
      <span className="flex items-center">
        <Image src="/gmail.png" alt="gmail" width={30} height={30} />{' '}
        <p className="px-5">{user.email}</p>
      </span>
    </section>
  );
};

export default UserProfile;
