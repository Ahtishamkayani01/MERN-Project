import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeToken = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const isLoggedIn = !!token;

  // Fetch user from token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // decode token payload (base64)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        logout();
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, storeToken, logout, isLoggedIn, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);