import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import {
  InvoiceFilters,
  InvoiceFormData,
  InvoiceResponse,
  InvoicesResponse,
} from "../../types/invoice.types";

export const InvoiceService = {
  getAll: async (filters: InvoiceFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.companyId) params.append("companyId", filters.companyId);
    if (filters.clientId) params.append("clientId", filters.clientId);
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentStatus)
      params.append("paymentStatus", filters.paymentStatus);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<InvoicesResponse>(
      `${API_ENDPOINTS.INVOICES.GET_ALL}?${params.toString()}`,
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<InvoiceResponse>(
      API_ENDPOINTS.INVOICES.GET_BY_ID(id),
    );
    return response.data.data.invoice;
  },

  create: async (data: InvoiceFormData) => {
    const response = await api.post<InvoiceResponse>(
      API_ENDPOINTS.INVOICES.CREATE,
      data,
    );
    return response.data.data.invoice;
  },

  update: async (id: string, data: Partial<InvoiceFormData>) => {
    const response = await api.patch<InvoiceResponse>(
      API_ENDPOINTS.INVOICES.UPDATE(id),
      data,
    );
    return response.data.data.invoice;
  },

  delete: async (id: string) => {
    await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.INVOICES.DELETE(id),
    );
  },
};
