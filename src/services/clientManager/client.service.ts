import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import {
  ClientFilters,
  ClientFormData,
  ClientResponse,
  ClientsResponse,
} from "../../types/client.types";

export const ClientService = {
  getAll: async (filters: ClientFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.companyId) params.append("companyId", filters.companyId);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<ClientsResponse>(
      `${API_ENDPOINTS.CLIENTS.GET_ALL}?${params.toString()}`,
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ClientResponse>(
      API_ENDPOINTS.CLIENTS.GET_BY_ID(id),
    );
    return response.data.data.client;
  },

  create: async (data: ClientFormData) => {
    const response = await api.post<ClientResponse>(
      API_ENDPOINTS.CLIENTS.CREATE,
      data,
    );
    return response.data.data.client;
  },

  update: async (id: string, data: Partial<ClientFormData>) => {
    const response = await api.patch<ClientResponse>(
      API_ENDPOINTS.CLIENTS.UPDATE(id),
      data,
    );
    return response.data.data.client;
  },

  delete: async (id: string) => {
    await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.CLIENTS.DELETE(id),
    );
  },
};
