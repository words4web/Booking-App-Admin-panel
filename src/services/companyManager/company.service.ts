import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../../lib/axios";
import { ApiResponse } from "../../types/api.types";
import {
  AllCompaniesResponse,
  CompanyDetailsResponse,
} from "../../types/company.types";
import { CompanyFormData } from "../../types/forms.types";

export const CompanyService = {
  createCompany: async (
    data: CompanyFormData,
  ): Promise<ApiResponse<CompanyDetailsResponse>> => {
    const response = await api.post(API_ENDPOINTS.COMPANIES.CREATE, data);
    return response.data;
  },

  getAllCompanies: async (
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<AllCompaniesResponse>> => {
    const response = await api.get(API_ENDPOINTS.COMPANIES.GET_ALL, {
      params: { page, limit },
    });
    return response.data;
  },

  getCompanyById: async (
    id: string,
  ): Promise<ApiResponse<CompanyDetailsResponse>> => {
    const response = await api.get(API_ENDPOINTS.COMPANIES.GET_BY_ID(id));
    return response.data;
  },

  updateCompany: async (
    id: string,
    data: Partial<CompanyFormData>,
  ): Promise<ApiResponse<CompanyDetailsResponse>> => {
    const response = await api.patch(API_ENDPOINTS.COMPANIES.UPDATE(id), data);
    return response.data;
  },

  deleteCompany: async (
    id: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    const response = await api.delete(API_ENDPOINTS.COMPANIES.DELETE(id));
    return response.data;
  },
};
