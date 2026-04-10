import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingService } from "./booking.service";
import { BookingFilters, BookingFormData } from "../../types/booking.types";
import { toast } from "react-toastify";

export const useBookingsQuery = (filters: BookingFilters = {}) => {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => BookingService.getAll(filters),
    refetchOnWindowFocus: false,
  });
};

export const useCalendarBookingsQuery = (
  year: number,
  month: number,
  companyId?: string,
) => {
  return useQuery({
    queryKey: ["bookings-calendar", year, month, companyId],
    queryFn: () => BookingService.getCalendar(year, month, companyId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBookingDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => BookingService.getById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
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
    // NOTE: Despite the name, this mutation calls the DELETE endpoint which now
    // performs a soft-cancel (sets status to CANCELLED) instead of deleting the record.
    mutationFn: (id: string) => BookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });
};

export const useReviewJobMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      status: string;
      adminNotes: string;
      durationMinutes?: number;
    }) => BookingService.reviewJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      toast.success("Job review submitted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit job review",
      );
    },
  });
};

export const useDeleteJobPhotoMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => BookingService.deletePhoto(id, key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      toast.success("Photo deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete photo");
    },
  });
};
