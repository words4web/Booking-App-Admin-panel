import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import {
  ProductFilters,
  ProductFormData,
  ProductResponse,
  ProductsResponse,
} from "../../types/product.types";

export const ProductService = {
  getAll: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.companyId) params.append("companyId", filters.companyId);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS.GET_ALL}?${params.toString()}`,
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.GET_BY_ID(id),
    );
    return response.data.data.product;
  },

  create: async (data: ProductFormData) => {
    const response = await api.post<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      data,
    );
    return response.data.data.product;
  },

  update: async (id: string, data: Partial<ProductFormData>) => {
    const response = await api.patch<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data,
    );
    return response.data.data.product;
  },

  delete: async (id: string) => {
    await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.PRODUCTS.DELETE(id),
    );
  },
};
