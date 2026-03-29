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
  });
};

export const useRemoveDeviceMutation = () => {
  return useMutation({
    mutationFn: (fcmToken: string) => DeviceService.removeToken(fcmToken),
  });
};
