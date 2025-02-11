import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { User } from "../models/user";
import Cookies from "js-cookie";
import axios from "axios";

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
    let token:any = Cookies.get("token");

    if (!token) {
      console.log("Brak tokena, próba odświeżenia...");
      token = await refreshAccessToken();
    }

    if (!token) {
      console.log("Nie udało się odświeżyć tokena, użytkownik wylogowany.");
      setLoggedUser({
        email: "",
        username: "",
        role: "guest",
        balance: 0,
        authenticated: false,
      });
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
        imageId: response.data.imageId,
        userId: response.data.userId,
      };

      console.log("User fetched:", user);
      setLoggedUser(user);
    } catch (error) {
      console.error("Błąd pobierania użytkownika:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post<{ accessToken: string }>(
        import.meta.env.VITE_REFRESH_API_URL,
        {},
        { withCredentials: true } // Wysyłamy refresh token jako HTTP-only cookie
      );
      console.log("Odświeżono token:", response.data.accessToken);
      Cookies.set("token", response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.error("Nie udało się odświeżyć tokena:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_LOGOUT_API_URL, {}, { withCredentials: true });
    } catch (error) {
      console.error("Błąd przy wylogowaniu:", error);
    }

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
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // Odświeżanie tokena co 14 minut

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedUser, loading, setLoggedUser, handleLogout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
