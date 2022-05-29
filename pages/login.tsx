import { FirebaseError } from 'firebase/app';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { FirestoreError, setDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import {
  auth,
  documentRef,
  facebookProvaider,
  googleProvider,
  usersCollection,
} from '../lib/firebase';
import { User } from '../lib/types';

const Login: NextPage = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({ email: '', password: '' });

  const onSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );

      await setDoc(documentRef<User>(`users/${user.uid}`), {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
      });

      await sendEmailVerification(user);
      toast.success('Verifica el email');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.message);
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    setFormValues({ ...formValues, [id]: value });
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await setDoc(documentRef<User>(`users/${user.uid}`), {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
      });
      router.push('/');
      toast.success('Bienvenido !');
    } catch (e) {
      console.log(e);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { user } = await signInWithPopup(auth, facebookProvaider);
      await setDoc(documentRef<User>(`users/${user.uid}`), {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
      });
      router.push('/');
      toast.success('Bienvenido');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className="flex flex-col items-center">
      <form className="bg-white w-1/2 h-full px-6 py-10 rounded-lg flex flex-col items-center">
        <h1 className="page-title">Crear Cuenta</h1>
        <div className="flex flex-col space-y-4 w-1/2">
          <input
            type="email"
            id="email"
            placeholder="Email"
            required
            value={formValues.email}
            onChange={onChange}
            className="input"
          />

          <input
            type="password"
            required
            placeholder="Password"
            id="password"
            value={formValues.password}
            onChange={onChange}
            className="input"
          />
          <button type="submit" onClick={onSubmit} className="primary-btn">
            {'Crear cuenta'}
          </button>
        </div>

        <p className="border-b-2 border-b-gray-300 pb-4 my-8 w-1/2 text-center">
          O
        </p>

        <div className="flex flex-col w-1/2 space-y-4">
          <button
            className="btn bg-white border border-gray-900 flex items-center"
            onClick={signInWithGoogle}
          >
            <Image src="/google.png" alt="google" width={30} height={30} />
            <p className="ml-4">Sign In With Google</p>
          </button>
          <button
            onClick={signInWithFacebook}
            className="btn bg-[#3b5998] text-white flex items-center"
          >
            <Image
              src="/facebook.png"
              alt="facebook"
              className="rounded-md"
              width={30}
              height={30}
            />
            <p className="ml-4">Sign In With Facebook</p>
          </button>
        </div>
      </form>
    </main>
  );
};

export default Login;
