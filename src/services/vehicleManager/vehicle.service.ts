import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../../lib/axios";
import {
  AllVehiclesResponse,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleDetailsResponse,
} from "../../types/vehicle.types";
import { ApiResponse } from "../../types/api.types";

export const VehicleService = {
  getAllVehicles: async (): Promise<ApiResponse<AllVehiclesResponse>> => {
    const response = await api.get(API_ENDPOINTS.VEHICLES.GET_ALL);
    return response.data;
  },

  getVehicleDetails: async (
    id: string,
  ): Promise<ApiResponse<VehicleDetailsResponse>> => {
    const response = await api.get(
      API_ENDPOINTS.VEHICLES.GET_VEHICLE_DETAILS(id),
    );
    return response.data;
  },

  createVehicle: async (
    data: CreateVehicleRequest,
  ): Promise<ApiResponse<VehicleDetailsResponse>> => {
    const response = await api.post(API_ENDPOINTS.VEHICLES.CREATE, data);
    return response.data;
  },

  updateVehicle: async (
    id: string,
    data: UpdateVehicleRequest,
  ): Promise<ApiResponse<VehicleDetailsResponse>> => {
    const response = await api.patch(API_ENDPOINTS.VEHICLES.UPDATE(id), data);
    return response.data;
  },

  deleteVehicle: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(API_ENDPOINTS.VEHICLES.DELETE(id));
    return response.data;
  },
};
