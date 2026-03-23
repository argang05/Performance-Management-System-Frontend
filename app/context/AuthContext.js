"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe, loginEmployee } from "@/lib/api";

const AuthContext = createContext(null);

const USER_KEY = "tor_ai_user";
const ACCESS_KEY = "tor_ai_access_token";
const REFRESH_KEY = "tor_ai_refresh_token";

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  const clearAuthState = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const persistAuthState = ({ employee, access, refresh }) => {
    setUser(employee);
    setAccessToken(access);
    setRefreshToken(refresh);

    localStorage.setItem(USER_KEY, JSON.stringify(employee));
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  };

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedAccess = localStorage.getItem(ACCESS_KEY);
        const storedRefresh = localStorage.getItem(REFRESH_KEY);

        if (!storedUser || !storedAccess || !storedRefresh) {
          clearAuthState();
          return;
        }

        try {
          const me = await fetchMe(storedAccess);

          setUser(me);
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          localStorage.setItem(USER_KEY, JSON.stringify(me));
        } catch (error) {
          console.warn("Stored session is invalid. Clearing auth.", error);
          clearAuthStorage();
          clearAuthState();
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        clearAuthStorage();
        clearAuthState();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async ({ employee_number, password }) => {
    const data = await loginEmployee({ employee_number, password });

    const employee = data?.employee;
    const access = data?.access;
    const refresh = data?.refresh;

    if (!employee || !access || !refresh) {
      throw new Error("Invalid login response from server.");
    }

    persistAuthState({ employee, access, refresh });
    router.push("/dashboard");
  };

  const logout = () => {
    clearAuthState();
    clearAuthStorage();
    router.push("/login");
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      isAuthenticated: !!user && !!accessToken,
      login,
      logout,
      setUser,
    }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}