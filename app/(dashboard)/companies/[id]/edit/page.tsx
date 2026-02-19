"use client";

import { CompanyForm } from "@/src/components/forms/CompanyForm";
import {
  useCompanyDetailsQuery,
  useUpdateCompanyMutation,
} from "@/src/services/companyManager/useCompanyQueries";
import { CompanyFormData } from "@/src/types/forms.types";
import { useRouter, useParams } from "next/navigation";
import { CommonLoader } from "@/src/components/common/CommonLoader";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const { data: company, isLoading } = useCompanyDetailsQuery(companyId);
  const updateMutation = useUpdateCompanyMutation(companyId);

  const handleSubmit = (data: CompanyFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        router.push("/companies");
      },
    });
  };

  if (isLoading) {
    return <CommonLoader />;
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Company not found.</p>
      </div>
    );
  }

  return (
    <CompanyForm
      mode="edit"
      initialData={company}
      onSubmit={handleSubmit}
      isPending={updateMutation.isPending}
    />
  );
}
