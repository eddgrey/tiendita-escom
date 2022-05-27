import { Review } from '../lib/types';
import Stars from './Stars';

type ReviewsListProps = {
  reviews: Review[];
};

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <>
      {reviews && (
        <section className="w-full">
          {reviews.map((review) => (
            <div
              key={review.title}
              className="flex flex-col w-full bg-white rounded-lg px-6 py-4 mb-4"
            >
              <h3 className="text-xl font-medium">{review.title}</h3>
              <Stars numStars={review.score} />
              <p>{review.comment}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default ReviewsList;
