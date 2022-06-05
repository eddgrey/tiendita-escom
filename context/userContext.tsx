import { onAuthStateChanged } from 'firebase/auth';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../lib/firebase';
import { Filter, User } from '../lib/types';

interface IUserContext {
  user: User | null;
  filters: Filter;
  setFilters: Dispatch<SetStateAction<Filter>>;
}

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<Filter>({
    category: 'todas',
    orderBy: 'totalScore',
  });

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user && user.emailVerified) {
          setUser({
            displayName: user.displayName,
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
          });
        } else {
          setUser(null);
        }
      },
      (error) => console.log(error)
    );
    return unsuscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, filters, setFilters }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw Error('Need to be insede of UserProvaider');
  }
  return context;
};
