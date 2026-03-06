"use client";

import { CompanyForm } from "@/src/components/forms/CompanyForm";
import { useCreateCompanyMutation } from "@/src/services/companyManager/useCompanyQueries";
import { CompanyFormData } from "@/src/types/forms.types";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function NewCompanyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMutation = useCreateCompanyMutation();

  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  if (!isSuperAdmin) {
    return <Forbidden />;
  }

  const handleSubmit = (data: CompanyFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES_PATH.COMPANIES.BASE);
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
