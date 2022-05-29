import { initializeApp } from 'firebase/app';
import {
  collection,
  collectionGroup,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  getFirestore,
  Query,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { Product, User } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvaider = new FacebookAuthProvider();
export const storage = getStorage(app);

// helper functions
export const getProductsUser = async (uid: string | undefined) => {
  const productsRef = collectionRef<Product>(`users/${uid}/products`);
  const products = (await getDocs(productsRef)).docs;
  return products.map((product) => product.data());
};

export const documentRef = <T = DocumentData,>(documentPath: string) => {
  return doc(firestore, documentPath) as DocumentReference<T>;
};

export const collectionGroupRef = <T = DocumentData,>(
  collectionName: string
) => {
  return collectionGroup(firestore, collectionName) as Query<T>;
};

export const collectionRef = <T = DocumentData,>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

// collections
export const productsCollection = collectionRef<Product>('products');
export const usersCollection = collectionRef<User>('users');
