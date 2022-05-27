import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../context/userContext';
import NavBar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NavBar />
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;
