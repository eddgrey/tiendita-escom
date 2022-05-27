import { getDoc, getDocs } from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { documentRef, usersCollection } from '../../lib/firebase';
import { User } from '../../lib/types';

export const getStaticProps: GetStaticProps = async (context) => {
  const userId = context.params?.usuario;
  const ref = documentRef<User>(`users/${userId}`);
  const user = (await getDoc(ref)).data();
  return {
    props: {
      user,
    },
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
  return (
    <main>
      <Image
        alt="photo User"
        className="rounded-full"
        src={`${user?.photoURL}`}
        width={80}
        height={80}
      />
      <p>{user?.displayName}</p>
      <p>{user.email}</p>
    </main>
  );
};

export default UserProfile;
