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
import {
  ACCESS_TOKEN,
  FCM_TOKEN,
  SESSION_ACTIVE,
} from "@/src/constants/user.constants";
import { AuthService } from "./auth.service";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useFcmLifecycle } from "@/src/hooks/useFcmLifecycle";

const AuthContext = createContext<IUserContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useFcmLifecycle(user);

  const { getLocalStorage, setLocalStorage, removeLocalStorageItem } =
    useLocalStorage();

  const router = useRouter();

  const token = getLocalStorage(ACCESS_TOKEN);

  const removeUserContext = useCallback(() => {
    removeLocalStorageItem(ACCESS_TOKEN);
    removeLocalStorageItem(SESSION_ACTIVE);
    removeLocalStorageItem(FCM_TOKEN);
    setUser(null);
    router.push(ROUTES_PATH.AUTH.LOGIN);
  }, [router, removeLocalStorageItem]);

  const setUserContext = useCallback(
    (newToken: string, userData: User) => {
      setLocalStorage(ACCESS_TOKEN, newToken);
      setLocalStorage(SESSION_ACTIVE, "true");
      setUser(userData);
      router.push(ROUTES_PATH.DASHBOARD);
    },
    [router, setLocalStorage],
  );

  const getLoggedInUser = useCallback(async () => {
    // If no token, maybe we can refresh it from cookie?
    const hasSessionHint = getLocalStorage(SESSION_ACTIVE);

    if (!token) {
      // Only attempt refresh if there was a previous session
      if (!hasSessionHint) {
        setIsUserLoading(false);
        return;
      }

      try {
        const refreshRes = await AuthService.refreshToken();
        if (refreshRes?.success && refreshRes?.data?.accessToken) {
          // Success! Interceptor already stored it if it went through axios,
          // but we manualy set it here just in case or to trigger re-run
          setLocalStorage(ACCESS_TOKEN, refreshRes.data.accessToken);
          setLocalStorage(SESSION_ACTIVE, "true");
          // Now try profile again
          const profileRes = await AuthService.getProfile();
          if (profileRes?.success && profileRes?.data.user) {
            setUser(profileRes.data.user);
            setIsUserLoading(false);
            return;
          }
        }
      } catch (refreshErr) {
        // Refresh failed, probably no valid cookie
        removeLocalStorageItem(SESSION_ACTIVE);
      }
      setIsUserLoading(false);
      removeUserContext();
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
  }, [
    token,
    removeUserContext,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorageItem,
  ]);

  useEffect(() => {
    if (!user) {
      getLoggedInUser();
    } else {
      setIsUserLoading(false);
    }
  }, [user, getLoggedInUser]);

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
