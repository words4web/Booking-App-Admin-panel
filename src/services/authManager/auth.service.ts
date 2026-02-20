import api from "../../lib/axios";
import { LoginApiResponse, ProfileApiResponse } from "../../types/auth.types";
import { LoginValues } from "../../types/forms.types";
import API_ENDPOINTS from "@/lib/Api_Endpoints";

export const AuthService = {
  login: async (values: LoginValues): Promise<LoginApiResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, values);
    return response.data;
  },

  getProfile: async (): Promise<ProfileApiResponse> => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};
