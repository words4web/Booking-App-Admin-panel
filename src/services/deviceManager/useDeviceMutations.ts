import { useMutation } from "@tanstack/react-query";
import { DeviceService } from "./device.service";

export const useSyncDeviceMutation = () => {
  return useMutation({
    mutationFn: ({
      fcmToken,
      platform,
    }: {
      fcmToken: string;
      platform: string;
    }) => DeviceService.syncToken(fcmToken, platform),
    onSuccess: () => {
      console.log("[FCM] Device sync successful");
    },
    onError: (error) => {
      console.error("[FCM] Device sync failed", error);
    },
  });
};

export const useRemoveDeviceMutation = () => {
  return useMutation({
    mutationFn: (fcmToken: string) => DeviceService.removeToken(fcmToken),
    onSuccess: () => {
      console.log("[FCM] Device removal successful");
    },
    onError: (error) => {
      console.error("[FCM] Device removal failed", error);
    },
  });
};
