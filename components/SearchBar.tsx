import {
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { productsCollection } from '../lib/firebase';

const SearchBar = () => {
  const [search, setSearch] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query(
      productsCollection,
      where('name', '>=', search),
      where('name', '<=', search + 'z')
    );
    const products = (await getDocs(q)).docs.map((product) => product.data());
    console.log(products);
    setSearch('');
  };

  return (
    <form onSubmit={onSubmit} className="flex text-gray-900 w-full">
      <input
        type="input"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-lg w-full focus:outline-none pl-4 text-gray-900 bg-gray-100"
      />
      <button
        type="submit"
        className="primary-btn rounded-l-none relative right-12 text-gray-200;"
      >
        <RiSearch2Line className="icon" />
      </button>
    </form>
  );
};

export default SearchBar;
