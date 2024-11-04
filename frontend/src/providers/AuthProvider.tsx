import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { User } from "../models/user";

type AuthProviderProps = {
  children: ReactNode;
};

export interface AuthContextType {
  loggedUser?: User;
  setLoggedUser: (user?: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  loggedUser: undefined,
  setLoggedUser: () => {},
});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);

  const loadUser = async () => {
        //fetch/axios do pobierania uzytkownika za pomoca tokenu 
    const user = {
    };

    //setLoggedUser(user);
  }

  useEffect(() => {
    if(loggedUser === undefined){
      loadUser();
    }
  },[])

  return (
    <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>
    {children}
  </AuthContext.Provider>   
  )
}