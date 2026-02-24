"use client";

import { VehicleForm } from "@/src/views/vehicles/VehicleForm";
import { useCreateVehicleMutation } from "@/src/services/vehicleManager/useVehicleQueries";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";

import { CreateVehicleRequest } from "@/src/types/vehicle.types";

export default function NewVehiclePage() {
  const createMutation = useCreateVehicleMutation();
  const router = useRouter();

  const handleSubmit = (data: CreateVehicleRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES_PATH.VEHICLES);
      },
    });
  };

  return (
    <VehicleForm
      mode="create"
      onSubmit={handleSubmit}
      isPending={createMutation.isPending}
    />
  );
}
