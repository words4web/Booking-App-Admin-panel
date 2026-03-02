import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import {
  BookingFilters,
  BookingFormData,
  BookingResponse,
  BookingsResponse,
  CalendarResponse,
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
    if (filters.assignedDriverId)
      params.append("assignedDriverId", filters.assignedDriverId);

    const response = await api.get<BookingsResponse>(
      `${API_ENDPOINTS.BOOKINGS.GET_ALL}?${params.toString()}`,
    );
    return response.data.data;
  },

  getCalendar: async (year: number, month: number, companyId?: string) => {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    if (companyId) params.append("companyId", companyId);
    const response = await api.get<CalendarResponse>(
      `${API_ENDPOINTS.BOOKINGS.CALENDAR}?${params.toString()}`,
    );
    return response.data.data.bookings;
  },

  getById: async (id: string) => {
    const response = await api.get<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.GET_BY_ID(id),
    );
    return response.data.data.booking;
  },

  create: async (data: BookingFormData) => {
    const response = await api.post<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      data,
    );
    return response.data.data.booking;
  },

  update: async (id: string, data: Partial<BookingFormData>) => {
    const response = await api.patch<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.UPDATE(id),
      data,
    );
    return response.data.data.booking;
  },

  delete: async (id: string) => {
    await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.BOOKINGS.DELETE(id),
    );
  },
  reviewJob: async (
    id: string,
    data: {
      status: string;
      adminNotes: string;
      durationMinutes?: number;
    },
  ) => {
    const response = await api.patch<BookingResponse>(
      API_ENDPOINTS.BOOKINGS.REVIEW(id),
      data,
    );
    return response.data.data.booking;
  },
};
