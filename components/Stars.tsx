type StarsProps = {
  numStars: number;
  showNum?: boolean;
};

import { RiStarFill, RiStarHalfFill } from 'react-icons/ri';

const Stars = ({ numStars, showNum = false }: StarsProps) => {
  const numIntStars = Math.floor(numStars);
  const numInt = numStars === numIntStars;

  const stars = Array<string>(5)
    .fill('half')
    .fill('fill', 0, numInt ? numIntStars : numIntStars - 1)
    .fill('line', numIntStars, 5);

  return (
    <div className="my-2">
      <span className="flex">
        {stars.map((star, idx) =>
          star === 'fill' ? (
            <RiStarFill key={idx} className="text-amber-500 w-6 h-6" />
          ) : star === 'line' ? (
            <RiStarFill key={idx} className="text-gray-300 w-6 h-6" />
          ) : (
            <RiStarHalfFill key={idx} className="text-amber-500 w-6 h-6" />
          )
        )}
      </span>
      {showNum && (
        <strong>
          {isNaN(parseInt(numStars.toFixed(1))) ? 0 : numStars.toFixed(1)}
        </strong>
      )}
    </div>
  );
};

export default Stars;
