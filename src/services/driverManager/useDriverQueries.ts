import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DriverService } from "./driver.service";
import { toast } from "react-toastify";

// Query Keys
export const driverKeys = {
  all: ["drivers"] as const,
  list: (page: number, limit: number) =>
    [...driverKeys.all, "list", { page, limit }] as const,
  detail: (id: string) => [...driverKeys.all, "detail", id] as const,
  deletedByUsers: [...["drivers"], "deleted-by-users"] as const,
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

export function useDeleteDriverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverId: string) => DriverService.deleteDriver(driverId),
    onSuccess: () => {
      toast.success("Driver deleted successfully!");
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete driver. Please try again.";
      toast.error(message);
    },
  });
}

export function useDeletedByUsersQuery() {
  return useQuery({
    queryKey: driverKeys.deletedByUsers,
    queryFn: () => DriverService.getDeletedByUsers(),
    select: (data) => data.data.drivers,
  });
}

export function useReviewDeletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => DriverService.reviewDeletion(id, status),
    onSuccess: (_data, variables) => {
      const msg =
        variables.status === "approved"
          ? "Account deletion approved. Documents have been wiped."
          : "Account deletion rejected. Driver account has been restored.";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: driverKeys.deletedByUsers });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to process request. Please try again.";
      toast.error(message);
    },
  });
}
