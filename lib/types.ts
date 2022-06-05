import { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string;
  seller: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  stock: number;
  soldUnits: number;
  numReviews: number;
  totalScore: number;
  images: ImageProduct[];
  published: boolean;
};

export type ProductCart = {
  id: string;
  seller: string;
  name: string;
  price: number;
  stock: number;
  image: ImageProduct;
  published: boolean;
  amount: number;
};

export type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export type ImageProduct = {
  imgName: string;
  imgUrl: string;
};

export enum Category {
  papeleria = 'papeleria',
  comida = 'comida',
  electronica = 'electronica',
  todo = 'todo',
}

export type Filter = {
  category: string;
  orderBy: string;
};

export type Review = {
  score: number;
  title: string;
  comment: string;
};

export type OrderedProduct = {
  id: string;
  image: ImageProduct;
  amount: number;
};

export type Order = {
  id: string;
  user?: string;
  userOrderId?: string;
  state: string;
  products: OrderedProduct[];
  total: number;
  date: Timestamp;
};
