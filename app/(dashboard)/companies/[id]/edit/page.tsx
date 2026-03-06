"use client";

import { CompanyForm } from "@/src/components/forms/CompanyForm";
import {
  useCompanyDetailsQuery,
  useUpdateCompanyMutation,
} from "@/src/services/companyManager/useCompanyQueries";
import { CompanyFormData } from "@/src/types/forms.types";
import { useRouter, useParams } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const companyId = params.id as string;

  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data: company, isLoading } = useCompanyDetailsQuery(companyId);
  const updateMutation = useUpdateCompanyMutation(companyId);

  const handleSubmit = (data: CompanyFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES_PATH.COMPANIES.BASE);
      },
    });
  };

  if (!isSuperAdmin) {
    return <Forbidden />;
  }

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
