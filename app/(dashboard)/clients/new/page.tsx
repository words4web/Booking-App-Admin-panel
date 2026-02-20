"use client";

import { ClientForm } from "@/src/views/clients/ClientForm";
import { useCreateClientMutation } from "@/src/services/clientManager/useClientQueries";
import { ClientFormData } from "@/src/types/client.types";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
  const router = useRouter();
  const createMutation = useCreateClientMutation();

  const handleSubmit = (data: ClientFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/clients");
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
