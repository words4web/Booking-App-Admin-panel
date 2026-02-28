import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingService } from "./booking.service";
import { BookingFilters, BookingFormData } from "../../types/booking.types";
import { toast } from "sonner";

export const useBookingsQuery = (filters: BookingFilters = {}) => {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => BookingService.getAll(filters),
  });
};

export const useBookingDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => BookingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingFormData) => BookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
};

export const useUpdateBookingMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BookingFormData>) =>
      BookingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      toast.success("Booking updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });
};

export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    },
  });
};
