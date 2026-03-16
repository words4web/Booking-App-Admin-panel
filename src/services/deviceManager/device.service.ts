import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";

export const DeviceService = {
  syncToken: async (fcmToken: string, platform: string): Promise<void> => {
    await api.post(API_ENDPOINTS.DEVICES.SYNC, { fcmToken, platform });
  },
  removeToken: async (fcmToken: string): Promise<void> => {
    await api.post(API_ENDPOINTS.DEVICES.REMOVE, { fcmToken });
  },
};
