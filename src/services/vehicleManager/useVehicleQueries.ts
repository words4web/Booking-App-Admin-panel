import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VehicleService } from "./vehicle.service";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "../../types/vehicle.types";
import { toast } from "react-toastify";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

export const useVehiclesQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...vehicleKeys.lists(), { page, limit }],
    queryFn: () =>
      VehicleService.getAllVehicles(page, limit).then((res) => res.data),
  });
};

export const useVehicleDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => VehicleService.getVehicleDetails(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleRequest) =>
      VehicleService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success("Vehicle created successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Failed to create vehicle");
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleRequest }) =>
      VehicleService.updateVehicle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.detail(variables.id),
      });
      toast.success("Vehicle updated successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Failed to update vehicle");
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success("Vehicle deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Failed to delete vehicle");
    },
  });
};
