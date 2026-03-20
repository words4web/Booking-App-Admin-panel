"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { useCalendarBookingsQuery } from "@/src/services/bookingManager/useBookingQueries";
import { CalendarBooking } from "@/src/types/booking.types";
import { BookingStatus } from "@/src/enums/booking.enum";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { cn } from "@/lib/utils";
import ROUTES_PATH from "@/lib/Route_Paths";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const STATUS_CONFIG: Record<
  BookingStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  [BookingStatus.SCHEDULED]: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: "Scheduled",
  },
  [BookingStatus.ACCEPTED]: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: "Accepted",
  },
  [BookingStatus.JOB_STARTED]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Job Started",
  },
  [BookingStatus.JOB_SUBMITTED]: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    label: "Submitted",
  },
  [BookingStatus.JOB_REJECTED]: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Rejected",
  },
  [BookingStatus.COMPLETED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Completed",
  },
};

function BookingPill({ booking }: { booking: CalendarBooking }) {
  const cfg = STATUS_CONFIG[booking.status] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: booking.status,
  };
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate max-w-full",
        cfg.bg,
        cfg.text,
      )}>
      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      <span className="truncate">{booking.bookingId}</span>
    </div>
  );
}

export function BookingCalendar() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const companyId =
    user?.role === UserRoles.COMPANY_ADMIN
      ? (user.companyId ?? undefined)
      : undefined;

  const { data: bookings = [], isLoading } = useCalendarBookingsQuery(
    currentMonth.year(),
    currentMonth.month() + 1, // 1-indexed
    companyId,
  );

  // Group bookings by date string "YYYY-MM-DD"
  const byDate = useMemo(() => {
    const map: Record<string, CalendarBooking[]> = {};
    bookings.forEach((b) => {
      const key = dayjs(b.scheduledDateTime).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  const selectedDateBookings = useMemo(() => {
    if (!selectedDay) return [];
    return byDate[selectedDay] ?? [];
  }, [byDate, selectedDay]);

  const firstDayOffset = currentMonth.startOf("month").day(); // 0=Sun
  const daysInMonth = currentMonth.daysInMonth();
  const today = dayjs().format("YYYY-MM-DD");

  const handleDayClick = (dateStr: string) => {
    setSelectedDay(dateStr);
    setPanelOpen(true);
  };

  const goToPrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const goToNext = () => setCurrentMonth(currentMonth.add(1, "month"));
  const goToToday = () => {
    setCurrentMonth(dayjs().startOf("month"));
    setSelectedDay(today);
    setPanelOpen(true);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* ── Calendar panel ── */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {currentMonth.format("MMMM YYYY")}
            </h1>
            {isLoading && (
              <span className="text-xs font-medium text-slate-400 animate-pulse">
                Loading…
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              Today
            </button>
            <button
              onClick={goToPrev}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {/* Offset empty cells */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border-b border-r border-slate-100 bg-slate-50/50"
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
            const dayBookings = byDate[dateStr] ?? [];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDay;
            const col = (firstDayOffset + i) % 7;
            const isLastCol = col === 6;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(dateStr)}
                className={cn(
                  "border-b border-r border-slate-100 p-2 cursor-pointer transition-all min-h-[100px] flex flex-col gap-1 group",
                  isLastCol ? "border-r-0" : "",
                  isSelected
                    ? "bg-primary/5 ring-2 ring-inset ring-primary/30"
                    : "hover:bg-slate-50",
                )}>
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-all",
                      isToday
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : isSelected
                          ? "text-primary"
                          : "text-slate-700 group-hover:text-primary",
                    )}>
                    {day}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Booking pills — show max 3, then +N */}
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {dayBookings.slice(0, 3).map((b) => (
                    <BookingPill key={b._id} booking={b} />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-400 pl-1">
                      +{dayBookings.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-8 py-4 border-t border-slate-100 bg-slate-50/50">
          {Object.values(STATUS_CONFIG).map((cfg) => (
            <div key={cfg.label} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
              <span className="text-xs font-medium text-slate-500">
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Day detail panel ── */}
      <div
        className={cn(
          "w-80 flex-shrink-0 transition-all duration-300",
          panelOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-8 pointer-events-none",
        )}>
        {panelOpen && selectedDay && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {dayjs(selectedDay).format("dddd")}
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  {dayjs(selectedDay).format("D MMMM YYYY")}
                </h2>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Bookings list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedDateBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    No bookings
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Nothing scheduled for this day
                  </p>
                </div>
              ) : (
                selectedDateBookings.map((b) => {
                  const cfg = STATUS_CONFIG[b.status] ?? {
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    dot: "bg-slate-400",
                    label: b.status,
                  };
                  return (
                    <button
                      key={b._id}
                      onClick={() =>
                        router.push(ROUTES_PATH.BOOKINGS.EDIT(b?._id))
                      }
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all group bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                          {b.bookingId}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            cfg.bg,
                            cfg.text,
                          )}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {b.clientName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">
                          {dayjs(b.scheduledDateTime).format("HH:mm")}
                        </span>
                        <span className="text-xs text-slate-300 font-medium ml-auto">
                          {b.serviceType}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Panel footer */}
            <div className="px-4 pb-4">
              <button
                onClick={() => router.push(ROUTES_PATH.BOOKINGS.NEW)}
                className="w-full py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                + New Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
