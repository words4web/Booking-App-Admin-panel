import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../../lib/axios";
import {
  AllDriversResponse,
  DriverDetailsResponse,
  VerifyDocumentResponse,
} from "../../types/driver.types";
import { ApiResponse } from "../../types/api.types";

export const DriverService = {
  getAllDrivers: async (
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<AllDriversResponse>> => {
    const response = await api.get(API_ENDPOINTS.DRIVERS.GET_ALL_DRIVERS, {
      params: { page, limit },
    });
    return response.data;
  },

  getDriverDetails: async (
    id: string,
  ): Promise<ApiResponse<DriverDetailsResponse>> => {
    const response = await api.get(
      API_ENDPOINTS.DRIVERS.GET_DRIVER_DETAILS(id),
    );
    return response.data;
  },

  verifyDocument: async (
    id: string,
    documentType: string,
    isVerified: boolean,
    reason?: string,
  ): Promise<ApiResponse<VerifyDocumentResponse>> => {
    const response = await api.patch(
      API_ENDPOINTS.DRIVERS.VERIFY_DOCUMENT(id),
      {
        documentType,
        isVerified,
        reason,
      },
    );
    return response.data;
  },
};
