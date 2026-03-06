"use client";

import { use } from "react";
import { VehicleForm } from "@/src/views/vehicles/VehicleForm";
import {
  useVehicleDetailsQuery,
  useUpdateVehicleMutation,
} from "@/src/services/vehicleManager/useVehicleQueries";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
import { CommonLoader } from "@/src/components/common/CommonLoader";

import { CreateVehicleRequest } from "@/src/types/vehicle.types";

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = use(params);
  const { data: vehicleData, isLoading, error } = useVehicleDetailsQuery(id);
  const updateMutation = useUpdateVehicleMutation();
  const router = useRouter();

  if (isLoading) {
    return (
      <CommonLoader fullScreen={false} message="Loading vehicle details..." />
    );
  }

  if (error || !vehicleData?.vehicle) {
    return (
      <div className="p-8 text-center text-red-500">
        Vehicle not found or an error occurred.
      </div>
    );
  }
  const { vehicle } = vehicleData;

  const handleSubmit = (data: CreateVehicleRequest) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push(ROUTES_PATH.VEHICLES.BASE);
        },
      },
    );
  };

  return (
    <VehicleForm
      mode="edit"
      initialData={vehicle}
      onSubmit={handleSubmit}
      isPending={updateMutation.isPending}
    />
  );
}
