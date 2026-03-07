"use client";

import { DriverList } from "@/src/views/drivers/DriverList";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function DriversPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  if (!isSuperAdmin) {
    return <Forbidden />;
  }

  return <DriverList />;
}
