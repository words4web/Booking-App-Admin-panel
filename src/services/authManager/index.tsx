"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/src/types/user.types";
import { type UserContext as IUserContext } from "@/src/types/auth.types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ACCESS_TOKEN } from "@/src/constants/user.constants";
import { AuthService } from "./auth.service";

const AuthContext = createContext<IUserContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const { getLocalStorage, setLocalStorage, removeLocalStorageItem } =
    useLocalStorage();

  const router = useRouter();

  const token = getLocalStorage(ACCESS_TOKEN);

  const getLoggedInUser = useCallback(async () => {
    if (!token) {
      setIsUserLoading(false);
      return;
    }

    try {
      const res = await AuthService.getProfile();

      if (res?.success && res?.data.user) {
        setUser(res.data.user);
      } else {
        removeUserContext();
      }
    } catch (error) {
      removeUserContext();
    } finally {
      setIsUserLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      getLoggedInUser();
    } else {
      setIsUserLoading(false);
    }
  }, [token, user, router]);

  const removeUserContext = useCallback(() => {
    removeLocalStorageItem(ACCESS_TOKEN);
    setUser(null);
    router.push("/login");
  }, []);

  const setUserContext = useCallback((newToken: string, userData: User) => {
    setLocalStorage(ACCESS_TOKEN, newToken);
    setUser(userData);
    router.push("/dashboard");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isUserLoading,
        setUserContext,
        removeUserContext,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
