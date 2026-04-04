import { createContext, useEffect, useMemo, useState } from "react";
import { loginUser, signupUser } from "../api/authApi";
import {
  clearAuthStorage,
  getStoredAuth,
  getStoredToken,
  getUserIdFromToken,
  saveAuthStorage
} from "../utils/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    if (auth) {
      saveAuthStorage(auth);
    } else {
      clearAuthStorage();
    }
  }, [auth]);

  const login = async payload => {
    const response = await loginUser(payload);

    if (!response.success) {
      throw new Error(response.message || "Unable to login");
    }

    setAuth({
      token: response.token,
      user: response.user
    });

    return response;
  };

  const signup = async payload => {
    const response = await signupUser(payload);

    if (!response.success) {
      throw new Error(response.message || "Unable to signup");
    }

    setAuth({
      token: response.token,
      user: response.user
    });

    return response;
  };

  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({
      token: auth?.token || "",
      user: auth?.user || null,
      userId: auth?.user?._id || getUserIdFromToken(getStoredToken()),
      isAuthenticated: Boolean(auth?.token),
      login,
      signup,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
