import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "./chat.service";

export const chatKeys = {
  all: ["chat"] as const,
  messages: (token: string) => [...chatKeys.all, "messages", token] as const,
  room: (token: string) => [...chatKeys.all, "room", token] as const,
};

// 10 seconds polling interval
const CHAT_POLL_INTERVAL = 10000;

export const useGetChatMessages = (
  token: string,
  options: { after?: string; enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: chatKeys.messages(token),
    queryFn: () => ChatService.getMessages(token, options.after),
    refetchInterval: options.enabled === false ? false : CHAT_POLL_INTERVAL,
    enabled: options.enabled !== false,
    retry: false, // Don't aggressively retry on 4xx / 410 expired
  });
};

export const useGetRoomStatus = (token: string) => {
  return useQuery({
    queryKey: chatKeys.room(token),
    queryFn: () => ChatService.getRoomStatus(token),
    retry: 1,
  });
};

export const useSendPublicMessage = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) =>
      ChatService.sendPublicMessage(token, message),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(token) });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<any>(
        chatKeys.messages(token),
      );

      // Optimistically update to the new value
      queryClient.setQueryData(chatKeys.messages(token), (old: any) => ({
        ...old,
        messages: [
          ...(old?.messages || []),
          {
            _id: `temp-${Date.now()}`,
            message: newMessage.trim(),
            senderType: "user",
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newMessage, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          chatKeys.messages(token),
          context.previousData,
        );
      }
    },
    // Always refetch after error or success to guarantee server sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(token) });
    },
  });
};

export const useSendAdminMessage = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) =>
      ChatService.sendAdminMessage(token, message),
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(token) });
      const previousData = queryClient.getQueryData<any>(
        chatKeys.messages(token),
      );

      queryClient.setQueryData(chatKeys.messages(token), (old: any) => ({
        ...old,
        messages: [
          ...(old?.messages || []),
          {
            _id: `temp-${Date.now()}`,
            message: newMessage.trim(),
            senderType: "admin",
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      return { previousData };
    },
    onError: (_err, _newMessage, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          chatKeys.messages(token),
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(token) });
    },
  });
};

export const useCloseChatRoom = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ChatService.closeRoom(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(token) });
    },
  });
};
