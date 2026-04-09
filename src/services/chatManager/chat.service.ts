import api from "@/src/lib/axios";
import API_ENDPOINTS from "@/lib/Api_Endpoints";
import { IChatMessage, ChatMessagesResponse, IChatRoomAuth } from "../../types/chat.types";

export const ChatService = {
  getRoomStatus: async (token: string) => {
    const response = await api.get<{ success: boolean; message: string; data: IChatRoomAuth }>(
      API_ENDPOINTS.CHAT.GET_ROOM(token)
    );
    return response.data;
  },

  getMessages: async (token: string, after?: string) => {
    const response = await api.get<{ success: boolean; data: ChatMessagesResponse }>(
      API_ENDPOINTS.CHAT.GET_MESSAGES(token, after)
    );
    return response.data.data;
  },

  sendPublicMessage: async (token: string, message: string) => {
    const response = await api.post<{ success: boolean; data: { message: IChatMessage } }>(
      API_ENDPOINTS.CHAT.SEND_PUBLIC(token),
      { message }
    );
    return response.data.data.message;
  },

  sendAdminMessage: async (token: string, message: string) => {
    const response = await api.post<{ success: boolean; data: { message: IChatMessage } }>(
      API_ENDPOINTS.CHAT.SEND_ADMIN(token),
      { message }
    );
    return response.data.data.message;
  },

  closeRoom: async (token: string) => {
    const response = await api.patch<{ success: boolean; message: string }>(
      API_ENDPOINTS.CHAT.CLOSE(token)
    );
    return response.data;
  },
};
