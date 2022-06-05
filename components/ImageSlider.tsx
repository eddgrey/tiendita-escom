import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { ImageProduct } from '../lib/types';

type Props = {
  images: ImageProduct[];
};

const ImageSlider = ({ images }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <section className="flex">
      <div className="flex flex-col space-y-2 mr-4">
        {images.map((image, idx) => (
          <ImagePreview
            key={image.imgName}
            image={image}
            idx={idx}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
          />
        ))}
      </div>

      <Image
        src={images[currentImage].imgUrl}
        alt=""
        width={270}
        height={270}
      />
    </section>
  );
};

type ImagePreviewProps = {
  image: ImageProduct;
  idx: number;
  currentImage: number;
  setCurrentImage: Dispatch<SetStateAction<number>>;
};

const ImagePreview = ({
  image,
  idx,
  currentImage,
  setCurrentImage,
}: ImagePreviewProps) => {
  const color = currentImage === idx ? 'blue' : 'gray';

  return (
    <div
      className={`border-2 border-${color}-200 p-1 flex justify-center items-center hover:cursor-pointer`}
      onClick={() => setCurrentImage(idx)}
    >
      <Image src={image.imgUrl} alt={image.imgName} width={80} height={80} />
    </div>
  );
};

export default ImageSlider;
