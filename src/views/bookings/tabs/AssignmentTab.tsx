"use client";

import { FormikProps } from "formik";
import { useQuery } from "@tanstack/react-query";

import { BookingFormData } from "@/src/types/booking.types";
import { Driver } from "@/src/types/driver.types";
import { Vehicle } from "@/src/types/vehicle.types";
import { BookingService } from "@/src/services/bookingManager/booking.service";
import { BookingStatus } from "@/src/enums/booking.enum";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignmentTabProps {
  formik: FormikProps<BookingFormData>;
  drivers: Driver[];
  vehicles: Vehicle[];
}

export function AssignmentTab({
  formik,
  drivers,
  vehicles,
}: AssignmentTabProps) {
  const selectedDriverId = formik.values.assignedDriverId;

  const { data: driverJobsData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["driverJobs", selectedDriverId],
    queryFn: () =>
      BookingService.getAll({
        assignedDriverId: selectedDriverId,
        limit: 100,
        getAll: true,
      }),
    enabled: !!selectedDriverId,
  });

  const driverJobs = (driverJobsData?.bookings || []).filter(
    (job) => job.status !== BookingStatus.COMPLETED,
  );

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.SCHEDULED:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case BookingStatus.ACCEPTED:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case BookingStatus.JOB_STARTED:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case BookingStatus.JOB_SUBMITTED:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case BookingStatus.COMPLETED:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };
  return (
    <div className="mt-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Assign Driver
          </Label>
          <div className="w-full">
            <Select
              onValueChange={(val) =>
                formik.setFieldValue(
                  "assignedDriverId",
                  val === "none" ? "" : val,
                )
              }
              value={formik.values.assignedDriverId || "none"}>
              <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all shadow-sm">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent className="bg-white w-[--radix-select-trigger-width]">
                <SelectItem value="none">Unassigned</SelectItem>
                {drivers &&
                  drivers?.length > 0 &&
                  drivers?.map((driver) => {
                    return (
                      <SelectItem key={driver?._id} value={driver?._id}>
                        {driver?.fullName}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Assign Vehicle
          </Label>
          <div className="w-full">
            <Select
              onValueChange={(val) =>
                formik.setFieldValue("vehicleId", val === "none" ? "" : val)
              }
              value={formik.values.vehicleId || "none"}>
              <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all shadow-sm">
                <SelectValue placeholder="No Vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-white w-[--radix-select-trigger-width]">
                <SelectItem value="none">No Vehicle</SelectItem>
                {vehicles &&
                  vehicles?.length > 0 &&
                  vehicles?.map((vehicle) => (
                    <SelectItem key={vehicle?._id} value={vehicle?._id}>
                      {vehicle?.vehicleName} ({vehicle?.vehicleNumber})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedDriverId && (
        <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Driver Schedule Preview
            </h4>
            {isHistoryLoading && (
              <span className="text-[10px] text-slate-400 animate-pulse font-bold">
                Loading schedule...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {driverJobs?.length > 0
              ? driverJobs?.map((job) => (
                  <div
                    key={job?._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <Clock className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {job?.bookingId}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0 ${getStatusColor(job?.status)}`}>
                            {job?.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                          <CalendarIcon className="h-3 w-3" />
                          {format(
                            new Date(job?.scheduledDateTime),
                            "MMM d, h:mm a",
                          )}
                          <span className="mx-1">•</span>
                          <span className="truncate max-w-[150px]">
                            {job?.clientId?.legalDetails?.legalName || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        Location
                      </p>
                      <p className="text-[12px] font-bold text-slate-700 truncate max-w-[150px]">
                        {job?.dropLocation.city || job?.dropLocation.postcode}
                      </p>
                    </div>
                  </div>
                ))
              : !isHistoryLoading && (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/30 text-center">
                    <p className="text-xs text-slate-400 font-bold">
                      No recent or upcoming jobs found for this driver.
                    </p>
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
