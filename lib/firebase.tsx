import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';

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
