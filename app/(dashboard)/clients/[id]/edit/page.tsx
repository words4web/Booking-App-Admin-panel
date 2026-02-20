"use client";

import { ClientForm } from "@/src/views/clients/ClientForm";
import {
  useClientDetailsQuery,
  useUpdateClientMutation,
} from "@/src/services/clientManager/useClientQueries";
import { ClientFormData } from "@/src/types/client.types";
import { useRouter, useParams } from "next/navigation";
import { CommonLoader } from "@/src/components/common/CommonLoader";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: client, isLoading } = useClientDetailsQuery(id);
  const updateMutation = useUpdateClientMutation();

  const handleSubmit = (data: ClientFormData) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/clients");
        },
      },
    );
  };

  if (isLoading) {
    return <CommonLoader />;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <ClientForm
      mode="edit"
      initialData={client}
      onSubmit={handleSubmit}
      isPending={updateMutation.isPending}
    />
  );
}
