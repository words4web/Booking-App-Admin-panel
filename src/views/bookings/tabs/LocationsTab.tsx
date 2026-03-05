"use client";

import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationsTabProps {
  formik: FormikProps<BookingFormData>;
  getFieldError: (name: string) => string | null;
}

export function LocationsTab({ formik, getFieldError }: LocationsTabProps) {
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("pickupLocation.addressLine1") &&
                  "border-destructive",
              )}
              placeholder="e.g. 123 High Street"
            />
            {getFieldError("pickupLocation.addressLine1") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("pickupLocation.addressLine1")}
              </p>
            )}
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("pickupLocation.city") && "border-destructive",
              )}
              placeholder="e.g. London"
            />
            {getFieldError("pickupLocation.city") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("pickupLocation.city")}
              </p>
            )}
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("pickupLocation.postcode") &&
                  "border-destructive",
              )}
              placeholder="e.g. SW1A 1AA"
            />
            {getFieldError("pickupLocation.postcode") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("pickupLocation.postcode")}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Country
            </Label>
            <Input
              {...formik.getFieldProps("pickupLocation.country")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. United Kingdom"
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("dropLocation.addressLine1") &&
                  "border-destructive",
              )}
              placeholder="e.g. 123 High Street"
            />
            {getFieldError("dropLocation.addressLine1") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("dropLocation.addressLine1")}
              </p>
            )}
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("dropLocation.city") && "border-destructive",
              )}
              placeholder="e.g. London"
            />
            {getFieldError("dropLocation.city") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("dropLocation.city")}
              </p>
            )}
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
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                getFieldError("dropLocation.postcode") && "border-destructive",
              )}
              placeholder="e.g. SW1A 1AA"
            />
            {getFieldError("dropLocation.postcode") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("dropLocation.postcode")}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Country
            </Label>
            <Input
              {...formik.getFieldProps("dropLocation.country")}
              className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. United Kingdom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
