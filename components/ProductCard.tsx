import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/types';
import Stars from './Stars';

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/producto/${product.id}`}>
      <div className="flex flex-col pt-2 rounded-lg bg-white shadow-md hover:shadow-2xl hover:ring-2 hover:ring-opacity-10 hover:ring-blue-800 hover:cursor-pointer">
        <div className="flex flex-col px-4">
          <h2 className="font-semibold text-xl text-center tracking-wide">
            {product.name}
          </h2>
          <Image
            src={product.images[0].imgUrl || '/'}
            alt={product.name}
            width={150}
            height={180}
          />
        </div>
        <div className="flex flex-col items-center py-4">
          <strong className="text-lg text-slate-900">${product.price}</strong>
          <Stars numStars={product.totalScore / product.numReviews} />
        </div>
        <button className="primary-btn rounded-t-none">Ver mas</button>
      </div>
    </Link>
  );
};

export default ProductCard;
