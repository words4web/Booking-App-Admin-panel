"use client";

import { DriverDetails } from "@/src/views/drivers/DriverDetails";
import { useParams } from "next/navigation";

export default function DriversPage() {
  const params = useParams();
  const driverId = params.id as string;
  return <DriverDetails driverId={driverId} />;
}
