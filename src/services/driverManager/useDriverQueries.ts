import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DriverService } from "./driver.service";
import { toast } from "react-toastify";

// Query Keys
export const driverKeys = {
  all: ["drivers"] as const,
  list: (page: number, limit: number) =>
    [...driverKeys.all, "list", { page, limit }] as const,
  detail: (id: string) => [...driverKeys.all, "detail", id] as const,
};

export function useAllDriversQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: driverKeys.list(page, limit),
    queryFn: () => DriverService.getAllDrivers(page, limit),
    select: (data) => data.data,
  });
}

export function useDriverDetailsQuery(driverId: string) {
  return useQuery({
    queryKey: driverKeys.detail(driverId),
    queryFn: () => DriverService.getDriverDetails(driverId),
    select: (data) => data.data.driver,
    enabled: !!driverId,
  });
}

export function useVerifyDocumentMutation(driverId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentType,
      isVerified,
      reason,
    }: {
      documentType: string;
      isVerified: boolean;
      reason?: string;
    }) =>
      DriverService.verifyDocument(driverId, documentType, isVerified, reason),
    onSuccess: () => {
      toast.success("Document status updated successfully!");
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(driverId) });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to update document status. Please try again.";
      toast.error(message);
    },
  });
}
