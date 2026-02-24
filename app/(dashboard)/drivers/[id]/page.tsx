"use client";

import { DriverDetails } from "@/src/views/drivers/DriverDetails";
import { useParams } from "next/navigation";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function DriversPage() {
  const params = useParams();
  const { user } = useAuth();
  const driverId = params.id as string;
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  if (!isSuperAdmin) {
    return <Forbidden />;
  }

  return <DriverDetails driverId={driverId} />;
}
