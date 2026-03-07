import { BookingCalendar } from "@/src/views/calendar/BookingCalendar";

export default function CalendarPage() {
  return (
    <div className="h-full p-0flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Booking Calendar</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          View all bookings across past, present, and future dates.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <BookingCalendar />
      </div>
    </div>
  );
}
