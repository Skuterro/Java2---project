import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { User } from "../models/user";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

type AuthProviderProps = {
  children: ReactNode;
};

export interface AuthContextType {
  loggedUser?: User;
  loading: boolean;
  setLoggedUser: (user?: User) => void;
  handleLogout: () => void;
  loadUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  loggedUser: undefined,
  loading: true,
  setLoggedUser: () => {},
  handleLogout: () => {},
  loadUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUser = async () => {
    const token = Cookies.get("token");
    console.log("Token:", token);
    /* DO NAPRAWIENIA. POWODUJE BLAD GDY PODA SIE NULLOWY TOKEN */
    if (token === undefined) {
      const user: User = {
        email: "",
        username: "",
        role: "guest",
        balance: 0,
        authenticated: false,
      };
      setLoggedUser(user);
      setLoading(false);
      return;
    }
    try {
      console.log("Fetching user...");
      const response = await axios.get<User>(import.meta.env.VITE_VERIFY_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user: User = {
        email: response.data.email,
        username: response.data.username,
        role: "user",
        balance: response.data.balance,
        authenticated: true,
      };
      console.log("User fetched:", user);
      setLoggedUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoggedUser({
        email: "",
        username: "",
        role: "guest",
        balance: 0,
        authenticated: false,
      });
      Cookies.remove("token");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggedUser({
      email: "",
      username: "",
      role: "guest",
      balance: 0,
      authenticated: false,
    });
    Cookies.remove("token");
  };
  

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedUser, loading, setLoggedUser, handleLogout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
