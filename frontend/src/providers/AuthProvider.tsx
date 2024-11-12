import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { User } from "../models/user";
import Cookies from "js-cookie";
import axios from "axios";

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

    const token = Cookies.get("token");
    const response = await axios.get<User>(import.meta.env.VITE_VERIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if(response.status !== 200){
      const user:User = {
        email: '',
        username: '',
        role: 'guest',
        balance: 0,
        authenticated: false
      }
      setLoggedUser(user);
      return;
    }
         
    const user:User = {
      email: response.data.email,
      username: response.data.username,
      role: 'user',
      balance: response.data.balance,
      authenticated: true
    };
    console.log("User fetched:", user);
    setLoggedUser(user);
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