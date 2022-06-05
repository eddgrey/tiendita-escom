import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useUserContext } from '../context/userContext';
import { RiMenuFill, RiShoppingCart2Fill, RiUser3Fill } from 'react-icons/ri';
import SearchBar from './SearchBar';
import FilterMenu from './FilterMenu';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const NavBar = () => {
  const router = useRouter();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const { user } = useUserContext();

  return (
    <nav className="h-[12vh] bg-gray-900 text-gray-200 text-lg">
      <ul className="h-full flex items-center px-6 lg:px-10">
        <div className="flex space-x-6 items-center w-1/2 sm:w-1/5">
          <li>
            <RiMenuFill
              className="icon hover:cursor-pointer"
              onClick={() => {
                if (router.pathname === '/') {
                  setShowFilterMenu((s) => !s);
                }
              }}
            />
            <FilterMenu show={showFilterMenu} />
          </li>
          <li>
            <Link href="/">
              <a className="font-semibold text-lg">Tiendita ESCOM</a>
            </Link>
          </li>
        </div>
        <li className="w-3/5 px-4 lg:px-10 hidden sm:block">
          <SearchBar />
        </li>
        <div className="flex w-1/2 sm:w-1/5 items-center justify-end space-x-2 sm:space-x-4">
          {user && (
            <>
              <li>
                <UserOptions />
              </li>
              <li>
                <Link href={`/carrito/${auth.currentUser?.uid}`}>
                  <a>
                    <RiShoppingCart2Fill className="icon" />
                  </a>
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await signOut(auth);
                    router.push('/');
                    toast.success('Se cerró sesión');
                  }}
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
          {!user && (
            <>
              <li>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/crear-cuenta">
                  <a>Crear cuenta</a>
                </Link>
              </li> */}
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

const UserOptions = () => {
  return (
    <div className=" relative group hover:cursor-pointer">
      <RiUser3Fill className="icon" />
      <div className="absolute top-6 bg-slate-600 py-2 w-[15vw] rounded-lg hidden group-hover:block">
        <ul className="flex flex-col space-y-2">
          <Option href={`/${auth.currentUser?.uid}`} name="Mi cuenta" />
          <Option href="/usuario/productos" name="Mis productos" />
          <Option href="/usuario/pedidos" name="Mis pedidos" />
          <Option href="/usuario/compras" name="Mis compras" />
        </ul>
      </div>
    </div>
  );
};

type OptionProps = {
  href: string;
  name: string;
};

const Option = ({ href, name }: OptionProps) => {
  return (
    <li className="hover:bg-slate-500 w-full py-1 px-2">
      <Link href={href}>
        <a>{name}</a>
      </Link>
    </li>
  );
};

export default NavBar;
