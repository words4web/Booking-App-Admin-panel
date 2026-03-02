"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string; // ISO string
  onChange: (isoString: string) => void;
  minDate?: string; // ISO string
  className?: string;
  disabled?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateTimePicker({
  value,
  onChange,
  minDate,
  className,
  disabled,
}: DateTimePickerProps) {
  const selected = value ? dayjs(value) : null;
  const [viewMonth, setViewMonth] = useState(
    selected ? selected.startOf("month") : dayjs().startOf("month"),
  );
  const [hour, setHour] = useState(selected ? selected.hour() : 9);
  const [minute, setMinute] = useState(selected ? selected.minute() : 0);
  const [open, setOpen] = useState(false);

  // Sync time fields when external value changes
  useEffect(() => {
    if (value) {
      const d = dayjs(value);
      setHour(d.hour());
      setMinute(d.minute());
      setViewMonth(d.startOf("month"));
    }
  }, [value]);

  const minDay = minDate ? dayjs(minDate).startOf("day") : null;

  const firstDayOfMonth = viewMonth.startOf("month").day(); // 0=Sun
  const daysInMonth = viewMonth.daysInMonth();

  const handleDayClick = (day: number) => {
    const newDate = viewMonth.date(day).hour(hour).minute(minute).second(0);
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: "hour" | "minute", delta: number) => {
    let newHour = hour;
    let newMin = minute;
    if (type === "hour") {
      newHour = (hour + delta + 24) % 24;
      setHour(newHour);
    } else {
      newMin = (minute + delta + 60) % 60;
      setMinute(newMin);
    }
    if (selected) {
      const updated = selected.hour(newHour).minute(newMin).second(0);
      onChange(updated.toISOString());
    }
  };

  const isDayDisabled = (day: number) => {
    if (!minDay) return false;
    return viewMonth.date(day).startOf("day").isBefore(minDay);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.date() === day &&
      selected.month() === viewMonth.month() &&
      selected.year() === viewMonth.year()
    );
  };

  const isToday = (day: number) => {
    const today = dayjs();
    return (
      today.date() === day &&
      today.month() === viewMonth.month() &&
      today.year() === viewMonth.year()
    );
  };

  const displayValue = selected
    ? selected.format("ddd, D MMM YYYY [at] HH:mm")
    : "Select date & time";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-3 h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed",
            selected ? "text-slate-900" : "text-slate-400",
            className,
          )}>
          <CalendarDays className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="flex-1 text-left">{displayValue}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 border-none shadow-2xl shadow-slate-900/20 rounded-2xl overflow-hidden"
        align="start"
        sideOffset={8}>
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Month navigation header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary to-primary/80">
            <button
              type="button"
              onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-white font-bold text-sm tracking-wide">
              {viewMonth.format("MMMM YYYY")}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth(viewMonth.add(1, "month"))}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-bold text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for first-day offset */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const disabled = isDayDisabled(day);
                const sel = isSelected(day);
                const today = isToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                      sel
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : today
                          ? "border-2 border-primary text-primary font-bold"
                          : "text-slate-700 hover:bg-primary/10 hover:text-primary",
                      disabled &&
                        "text-slate-300 cursor-not-allowed hover:bg-transparent hover:text-slate-300",
                    )}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time selector */}
          <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Time
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {/* Hour stepper */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTimeChange("hour", 1)}
                    className="p-1 rounded-md hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                    <ChevronLeft className="h-3 w-3 rotate-90" />
                  </button>
                  <div className="w-10 h-9 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-800 shadow-sm">
                    {String(hour).padStart(2, "0")}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange("hour", -1)}
                    className="p-1 rounded-md hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                    <ChevronLeft className="h-3 w-3 -rotate-90" />
                  </button>
                </div>

                <span className="text-xl font-bold text-slate-400 mb-0.5">
                  :
                </span>

                {/* Minute stepper */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTimeChange("minute", 5)}
                    className="p-1 rounded-md hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                    <ChevronLeft className="h-3 w-3 rotate-90" />
                  </button>
                  <div className="w-10 h-9 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-800 shadow-sm">
                    {String(minute).padStart(2, "0")}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange("minute", -5)}
                    className="p-1 rounded-md hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                    <ChevronLeft className="h-3 w-3 -rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <div className="px-5 pb-4">
            <Button
              type="button"
              className="w-full rounded-xl h-10 font-bold shadow-md shadow-primary/20"
              onClick={() => setOpen(false)}
              disabled={!selected}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
