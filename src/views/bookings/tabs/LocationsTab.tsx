"use client";

import { useState } from "react";
import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { ServiceType } from "@/src/enums/booking.enum";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationsTabProps {
  formik: FormikProps<BookingFormData>;
  getFieldError: (name: string) => string | null;
}

export function LocationsTab({ formik, getFieldError }: LocationsTabProps) {
  const isHaulage = formik.values.serviceType === ServiceType.HAULAGE;

  const [showPickup, setShowPickup] = useState(false);
  const [showDrop, setShowDrop] = useState(!isHaulage);

  return (
    <div className="mt-0 space-y-12 animate-in fade-in duration-500">
      {/* Pickup Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 text-xs shadow-sm">
              A
            </span>
            Pickup Address
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPickup(!showPickup)}
            className="rounded-xl h-8 text-xs font-bold">
            {showPickup ? "Minimize" : "Change Pickup Address"}
          </Button>
        </h3>

        {!showPickup ? (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p className="text-slate-700 font-medium">
              Rkb house, Gravesend, kent, DA12 2RU, United Kingdom
            </p>
          </div>
        ) : (
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
            {/* Country field omitted */}
          </div>
        )}
      </div>

      {/* Drop-off Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs shadow-sm">
              B
            </span>
            Drop-off Address
            {isHaulage && (
              <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Optional for Haulage
              </span>
            )}
          </div>
          {!showDrop && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowDrop(true)}
              className="text-xs h-8">
              Add Drop-off Address
            </Button>
          )}
        </h3>

        {showDrop && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Address Line 1
              </Label>
              <Input
                {...formik.getFieldProps("dropLocation.addressLine1")}
                className={cn(
                  "h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm",
                  !isHaulage &&
                    getFieldError("dropLocation.addressLine1") &&
                    "border-destructive",
                )}
                placeholder="e.g. 123 High Street"
              />
              {!isHaulage && getFieldError("dropLocation.addressLine1") && (
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
                  !isHaulage &&
                    getFieldError("dropLocation.city") &&
                    "border-destructive",
                )}
                placeholder="e.g. London"
              />
              {!isHaulage && getFieldError("dropLocation.city") && (
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
                  !isHaulage &&
                    getFieldError("dropLocation.postcode") &&
                    "border-destructive",
                )}
                placeholder="e.g. SW1A 1AA"
              />
              {!isHaulage && getFieldError("dropLocation.postcode") && (
                <p className="text-xs text-destructive font-medium">
                  {getFieldError("dropLocation.postcode")}
                </p>
              )}
            </div>
            {/* Country field omitted */}
          </div>
        )}
      </div>
    </div>
  );
}
