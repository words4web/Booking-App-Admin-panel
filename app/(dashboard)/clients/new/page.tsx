"use client";

import { ClientForm } from "@/src/views/clients/ClientForm";
import { useCreateClientMutation } from "@/src/services/clientManager/useClientQueries";
import { ClientFormData } from "@/src/types/client.types";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";

export default function NewClientPage() {
  const router = useRouter();
  const createMutation = useCreateClientMutation();

  const handleSubmit = (data: ClientFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES_PATH.CLIENTS.BASE);
      },
    });
  };

  return (
    <ClientForm
      mode="create"
      onSubmit={handleSubmit}
      isPending={createMutation.isPending}
    />
  );
}
