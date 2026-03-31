"use client";

import ROUTES_PATH from "@/lib/Route_Paths";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const prams = useParams();
  const id = prams.id as string;

  useEffect(() => {
    if (id) {
      router.replace(ROUTES_PATH.INVOICES.EDIT(id));
    }
  }, [id]);

  return <CommonLoader />;
}
