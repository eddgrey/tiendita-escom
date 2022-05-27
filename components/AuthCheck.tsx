import Link from 'next/link';
import { ReactNode } from 'react';
import { useUserContext } from '../context/userContext';

interface Props {
  children: ReactNode;
}

const AuthCheck = (props: Props) => {
  const { user } = useUserContext();
  return (
    <>
      {user ? props.children : <Link href="/enter">You must be signed in</Link>}
    </>
  );
};

export default AuthCheck;
