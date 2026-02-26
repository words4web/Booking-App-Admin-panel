import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import {
  Booking,
  BookingFilters,
  BookingFormData,
  BookingResponse,
  BookingsResponse,
} from "../../types/booking.types";

export const BookingService = {
  getAll: async (filters: BookingFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.companyId) params.append("companyId", filters.companyId);
    if (filters.clientId) params.append("clientId", filters.clientId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<BookingsResponse>(
      `${API_ENDPOINTS.BOOKINGS.GET_ALL}?${params.toString()}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.GET_BY_ID(id)
    );
    return response.data.data.booking;
  },

  create: async (data: BookingFormData) => {
    const response = await api.post<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      data
    );
    return response.data.data.booking;
  },

  update: async (id: string, data: Partial<BookingFormData>) => {
    const response = await api.patch<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.UPDATE(id),
      data
    );
    return response.data.data.booking;
  },

  delete: async (id: string) => {
    await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.BOOKINGS.DELETE(id)
    );
  },

  assignDriver: async (id: string, data: { assignedDriverId: string; vehicleId: string }) => {
    const response = await api.post<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.ASSIGN_DRIVER(id),
      data
    );
    return response.data.data.booking;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
      { status }
    );
    return response.data.data.booking;
  },

  getStats: async () => {
    const response = await api.get<any>(API_ENDPOINTS.BOOKINGS.STATS);
    return response.data.data;
  },
};
