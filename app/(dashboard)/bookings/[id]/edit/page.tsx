"use client";

import { useRouter, useParams } from "next/navigation";
import { BookingForm } from "@/src/views/bookings/BookingForm";
import { BookingFormData } from "@/src/types/booking.types";
import {
  useBookingDetailsQuery,
  useUpdateBookingMutation,
} from "@/src/services/bookingManager/useBookingQueries";
import { Loader2 } from "lucide-react";
import ROUTES_PATH from "@/lib/Route_Paths";

export default function EditBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: booking, isLoading } = useBookingDetailsQuery(id);
  const { mutate: updateBooking, isPending } = useUpdateBookingMutation(id);

  const handleSubmit = (values: BookingFormData) => {
    updateBooking(values, {
      onSuccess: () => {
        router.push(ROUTES_PATH.BOOKINGS.BASE);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <BookingForm
      initialData={booking}
      onSubmit={handleSubmit}
      isLoading={isPending}
    />
  );
}
