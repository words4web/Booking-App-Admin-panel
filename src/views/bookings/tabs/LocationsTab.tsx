"use client";

import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationsTabProps {
  formik: FormikProps<BookingFormData>;
}

export function LocationsTab({ formik }: LocationsTabProps) {
  return (
    <div className="mt-0 space-y-12 animate-in fade-in duration-500">
      {/* Pickup Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 text-xs shadow-sm">
            A
          </span>
          Pickup Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Address Line 1
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.addressLine1")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. 123 High Street"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Address Line 2 (Optional)
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.addressLine2")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. Apartment, unit, building..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              City
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.city")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. London"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              County (Optional)
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.county")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. Greater London"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Postcode
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.postcode")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. SW1A 1AA"
            />
          </div>
        </div>
      </div>

      {/* Drop-off Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs shadow-sm">
            B
          </span>
          Drop-off Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Address Line 1
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.addressLine1")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. 123 High Street"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Address Line 2 (Optional)
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.addressLine2")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. Apartment, unit, building..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              City
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.city")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. London"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              County (Optional)
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.county")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. Greater London"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Postcode
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.postcode")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
              placeholder="e.g. SW1A 1AA"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
