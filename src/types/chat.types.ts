export type ChatRoomStatus = "active" | "closed";

export interface IChatRoomAuth {
  status: ChatRoomStatus;
}

export interface IChatMessage {
  _id: string;
  roomId: string;
  senderType: "admin" | "user";
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessagesResponse {
  messages: IChatMessage[];
  roomStatus: ChatRoomStatus;
}
