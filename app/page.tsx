"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/services/authManager";
import ROUTES_PATH from "@/lib/Route_Paths";
import { CommonLoader } from "@/src/components/common/CommonLoader";

export default function Page() {
  const router = useRouter();
  const { user, isUserLoading, token } = useAuth();

  useEffect(() => {
    if (isUserLoading) return;

    if (token && !user) return;

    if (!token) {
      router.replace(ROUTES_PATH.AUTH.LOGIN);
    } else if (user) {
      router.replace(ROUTES_PATH.DASHBOARD);
    }
  }, [router, isUserLoading, token, user]);

  if (isUserLoading || (token && !user)) {
    return <CommonLoader message="Checking authentication..." />;
  }

  return null;
}
