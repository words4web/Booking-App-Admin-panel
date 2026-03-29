"use client";

import { AccountDeletionRequests } from "@/src/views/account-deletion-requests/AccountDeletionRequests";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function AccountDeletionRequestsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  if (!isSuperAdmin) {
    return <Forbidden />;
  }

  return <AccountDeletionRequests />;
}
