import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { auth, storage } from '../lib/firebase';
import { ImageProduct } from '../lib/types';
import { RiDeleteBin2Fill, RiDeleteBin6Fill } from 'react-icons/ri';
import Loader from './Loader';
import Image from 'next/image';

type Props = {
  images: ImageProduct[];
  setImages: Dispatch<SetStateAction<ImageProduct[]>>;
};

const ImageUploader = ({ images, setImages }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('0');

  const deleteImage = async (imgName: string) => {
    try {
      const imgRef = ref(
        storage,
        `uploads/${auth.currentUser?.uid}/${imgName}`
      );
      await deleteObject(imgRef);
      setImages(images.filter((img) => img.imgName !== imgName));
    } catch (e) {
      console.log(e);
    }
  };

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const extension = files[0].type.split('/')[1];
      const fileName = files[0].name.split('.')[0];
      const imgName = `${fileName}_${Date.now()}.${extension}`;

      // Makes reference to the storage bucket location
      const imgRef = ref(
        storage,
        `uploads/${auth.currentUser?.uid}/${imgName}`
      );
      setUploading(true);

      // Start the upload
      const uploadTask = uploadBytesResumable(imgRef, files[0]);

      // Listen to updates to upload task
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          setProgress(progress);

          // Get downLoadURL After task resolves
        },
        (error) => {
          console.log(error.name, error.cause, error.message);
        },
        () => {
          getDownloadURL(imgRef).then((imgUrl) => {
            setImages([...images, { imgName, imgUrl }]);
            setUploading(false);
          });
        }
      );
    }
  };
  return (
    <div className="flex flex-col">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <>
          <label>Subir Imagen</label>
          <input
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
          />
        </>
      )}
      {images.length > 0 && (
        <ul>
          {images.map(({ imgName, imgUrl }) => (
            <li key={imgName} className="flex items-center justify-between">
              <Image src={imgUrl} alt={imgName} width={40} height={40} />
              <p className=" font-medium">{imgName}</p>
              <button
                className="p-2 rounded-lg"
                type="button"
                onClick={() => deleteImage(imgName)}
              >
                <RiDeleteBin2Fill className="text-red-600 w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageUploader;
