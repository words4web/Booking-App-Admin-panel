import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../lib/axios";
import { FCM_TOKEN } from "../constants/user.constants";

export const SettingsService = {
  getSettings: async (): Promise<{
    data: { isNotificationEnabled: boolean };
  }> => {
    const fcmToken = localStorage.getItem(FCM_TOKEN);
    const response = await api.get(API_ENDPOINTS.SETTINGS.GET, {
      headers: {
        "x-fcm-token": fcmToken,
      },
    });
    return response.data;
  },

  updateNotificationPreference: async (
    isNotificationEnabled: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    const fcmToken = localStorage.getItem(FCM_TOKEN);
    const response = await api.patch(API_ENDPOINTS.SETTINGS.UPDATE_PREFERENCE, {
      isNotificationEnabled,
      fcmToken,
    });
    return response.data;
  },
};
