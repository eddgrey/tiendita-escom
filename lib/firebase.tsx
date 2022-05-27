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
  apiKey: 'AIzaSyBKoNj4yRm0m3YDUHJS4W4nc5Xy5Yr5x5g',
  authDomain: 'tienda-escom.firebaseapp.com',
  projectId: 'tienda-escom',
  storageBucket: 'tienda-escom.appspot.com',
  messagingSenderId: '813924978995',
  appId: '1:813924978995:web:9a2d3907dddcb9d655ee46',
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
  // console.log('docs', products);
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
