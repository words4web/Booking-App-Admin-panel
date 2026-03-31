import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "./notification.service";
import { toast } from "react-toastify";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", { page, limit }] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

export function useNotificationsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () => NotificationService.getNotifications(page, limit),
    select: (data) => data.data,
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => NotificationService.getUnreadCount(),
    select: (data) => data.data.count,
    refetchInterval: 1000 * 60 * 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("All notifications marked as read");
    },
  });
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
