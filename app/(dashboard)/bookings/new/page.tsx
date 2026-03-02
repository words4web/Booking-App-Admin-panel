"use client";

import { useRouter } from "next/navigation";
import { BookingForm } from "@/src/views/bookings/BookingForm";
import { BookingFormData } from "@/src/types/booking.types";
import { useCreateBookingMutation } from "@/src/services/bookingManager/useBookingQueries";

export default function NewBookingPage() {
  const router = useRouter();
  const { mutate: createBooking, isPending } = useCreateBookingMutation();

  const handleSubmit = (values: BookingFormData) => {
    createBooking(values, {
      onSuccess: () => {
        router.push("/bookings");
      },
    });
  };

  return <BookingForm onSubmit={handleSubmit} isLoading={isPending} />;
}
