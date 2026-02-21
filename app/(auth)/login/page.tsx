"use client";

import { Login } from "@/src/views/auth/Login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useAuth } from "@/src/services/authManager";
import ROUTES_PATH from "@/lib/Route_Paths";

export default function LoginPage() {
  const { token, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && token) {
      router.replace(ROUTES_PATH.DASHBOARD);
    }
  }, [isUserLoading, token, router]);

  if (isUserLoading || token) {
    return <CommonLoader message="Checking authentication..." />;
  }

  return <Login />;
}
