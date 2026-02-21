import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "./settings.service";
import { toast } from "react-toastify";

export const settingsKeys = {
  all: ["settings"] as const,
  preferences: () => [...settingsKeys.all, "preferences"] as const,
};

export function useSettingsQuery() {
  return useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn: () => SettingsService.getSettings(),
    select: (data) => data.data,
  });
}

export function useUpdateNotificationPreferenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isEnabled: boolean) =>
      SettingsService.updateNotificationPreference(isEnabled),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success(data.message || "Preference updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update preference",
      );
    },
  });
}
