"use client";

import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Driver } from "@/src/types/driver.types";
import { Vehicle } from "@/src/types/vehicle.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
              value={formik.values.assignedDriverId || "none"}
            >
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
              value={formik.values.vehicleId || "none"}
            >
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

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Vehicle Type Preference
          </Label>
          <Input
            placeholder="e.g. 8 Wheeler, Grab"
            {...formik.getFieldProps("vehicleType")}
            className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
