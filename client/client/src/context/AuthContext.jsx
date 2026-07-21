import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { setAuthToken } from "../api/axios";

const AuthContext = createContext(null);

const getInitialAuth = () => {
  try {
    const stored = localStorage.getItem("corner-auth");
    return stored
      ? JSON.parse(stored)
      : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const initialAuth = getInitialAuth();
setAuthToken(initialAuth.token);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuth);

  useEffect(() => {
    localStorage.setItem("corner-auth", JSON.stringify(auth));
    setAuthToken(auth.token);
  }, [auth]);

  const login = (data) => {
    setAuth({ user: data.user, token: data.token });
    setAuthToken(data.token);
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
        isAuthenticated: Boolean(auth.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
