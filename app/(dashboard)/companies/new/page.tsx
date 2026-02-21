"use client";

import { CompanyForm } from "@/src/components/forms/CompanyForm";
import { useCreateCompanyMutation } from "@/src/services/companyManager/useCompanyQueries";
import { CompanyFormData } from "@/src/types/forms.types";
import { useRouter } from "next/navigation";

export default function NewCompanyPage() {
  const router = useRouter();
  const createMutation = useCreateCompanyMutation();

  const handleSubmit = (data: CompanyFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/companies");
      },
    });
  };

  return (
    <CompanyForm
      mode="create"
      onSubmit={handleSubmit}
      isPending={createMutation.isPending}
    />
  );
}
