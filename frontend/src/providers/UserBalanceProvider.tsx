import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';

type UserBalanceProviderProps = {
  children: ReactNode;
}

interface UserBalanceContextType {
  userBalance: number;
  setUserBalance: (balance: number) => void;
}

const UserBalanceContext = createContext<UserBalanceContextType>({
  userBalance: 0.0,
  setUserBalance: () => {},
});

export const useUserBalance = () => useContext(UserBalanceContext);

export const UserBalanceProvider = ({ children }: UserBalanceProviderProps) => {
  const [userBalance, setUserBalance] = useState<number | 0.0>(0.0);
  const {loggedUser} = useAuth();

  const loadUserBalance = () => {
    if(loggedUser){
      setUserBalance(loggedUser.balance); 
    }
    return;
  }

  useEffect(() => {
    loadUserBalance();
  }, [loggedUser]);

  return (
    <UserBalanceContext.Provider value={{ userBalance, setUserBalance }}>
      {children}
    </UserBalanceContext.Provider>
  );
};
