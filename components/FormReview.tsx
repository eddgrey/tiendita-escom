import { getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { auth, collectionRef, documentRef } from '../lib/firebase';
import { Product, Review } from '../lib/types';

interface FormReviewProps {
  product: Product;
}

const FormReview = ({ product }: FormReviewProps) => {
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const uid = auth.currentUser?.uid;
    e.preventDefault();

    const reviewRef = documentRef<Review>(
      `products/${product.id}/reviews/${uid}`
    );
    const productRef = documentRef<Product>(`products/${product.id}`);

    const reviewDoc = (await getDoc(reviewRef)).data();

    if (!reviewDoc) {
      await updateDoc(productRef, {
        numReviews: increment(1),
        totalScore: increment(formValues.score),
      });
    } else {
      await updateDoc(productRef, {
        totalScore: increment(formValues.score - reviewDoc.score),
      });
    }

    await setDoc(reviewRef, {
      title: formValues.title,
      comment: formValues.comment,
      score: formValues.score,
    });

    toast.success('Completado');
    router.push(`/producto/${product.id}`);
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const id = e.target.id;
    const value = e.target.value;

    setFormValues({
      ...formValues,
      [id]: id === 'score' ? parseInt(value) : value,
    });
  };

  const [formValues, setFormValues] = useState<Review>({
    title: '',
    comment: '',
    score: 0,
  });

  useEffect(() => {
    const reviewRef = documentRef<Review>(
      `products/${product.id}/reviews/${auth.currentUser?.uid}`
    );
    getDoc(reviewRef).then((review) => {
      const data = review.data();
      setFormValues({
        title: data ? data.title : '',
        comment: data ? data.comment : '',
        score: data ? data.score : 0,
      });
    });
  }, [product.id]);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg w-full lg:w-1/2 py-6 px-14 space-y-4 flex flex-col"
    >
      <h1 className="page-title">Reseña a {product.name}</h1>
      <div>
        <label htmlFor="title" className="font-medium">
          Titulo
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="input"
          value={formValues.title}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="comment" className="font-medium">
          Comentario
        </label>
        <textarea
          name="comment"
          id="comment"
          className="input"
          cols={7}
          rows={10}
          value={formValues.comment}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="score" className="font-medium">
          Estrellas
        </label>
        <select
          name="score"
          className="input"
          id="score"
          required
          value={formValues.score}
          onChange={onChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <button type="submit" className="primary-btn btn w-1/2 self-center">
        Enviar
      </button>
    </form>
  );
};

export default FormReview;
