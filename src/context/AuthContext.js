import { createContext, useState } from "react";
import { isTokenValid } from "../helpers/Tokenhelpers";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") ?? ""); //  Ambil token dari localStorage atau state
  const tokenValid = isTokenValid(token); //  Cek apakah token valid
  const [isAuthenticated, setIsAuthenticated] = useState(tokenValid);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
