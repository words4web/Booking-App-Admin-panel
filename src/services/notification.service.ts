import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../lib/axios";

export interface Notification {
  _id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AllNotificationsResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const NotificationService = {
  getNotifications: async (
    page = 1,
    limit = 20,
  ): Promise<{ data: AllNotificationsResponse }> => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL, {
      params: { page, limit },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ data: { count: number } }> => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  markAllRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },

  markRead: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },
};
