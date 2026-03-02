"use client";

import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Client } from "@/src/types/client.types";
import { ServiceType } from "@/src/enums/booking.enum";
import { UserRoles } from "@/src/enums/roles.enum";
import { Company } from "@/src/types/company.types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/src/components/DateTimePicker";

interface DetailsTabProps {
  formik: FormikProps<BookingFormData>;
  clients: Client[];
  getFieldError: (name: string) => string | null;
  companies?: Company[];
  userRole?: UserRoles;
  onCompanyChange: (companyId: string) => void;
}

export function DetailsTab({
  formik,
  clients,
  getFieldError,
  companies,
  userRole,
  onCompanyChange,
}: DetailsTabProps) {
  const isSuperAdmin = userRole === UserRoles.SUPER_ADMIN;

  return (
    <div className="mt-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isSuperAdmin && (
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Company</Label>
            <div className="w-full">
              <Select
                onValueChange={onCompanyChange}
                value={formik.values.companyId}>
                <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="bg-white w-[--radix-select-trigger-width]">
                  {companies?.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {getFieldError("companyId") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("companyId")}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Client</Label>
          <div className="w-full">
            <Select
              onValueChange={(val) => formik.setFieldValue("clientId", val)}
              value={formik.values.clientId}
              disabled={
                !formik.values.companyId ||
                (isSuperAdmin && clients?.length === 0)
              }>
              <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue
                  placeholder={
                    !formik.values.companyId
                      ? "Select a company first"
                      : "Select a client"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white w-[--radix-select-trigger-width]">
                {clients?.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.legalDetails.legalName} (
                      {client.contactInfo.firstName}{" "}
                      {client.contactInfo.lastName})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No clients found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {getFieldError("clientId") && (
            <p className="text-xs text-destructive font-medium">
              {getFieldError("clientId")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">
            Service Type
          </Label>
          <div className="w-full">
            <Select
              onValueChange={(val) => formik.setFieldValue("serviceType", val)}
              value={formik.values.serviceType}>
              <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white w-[--radix-select-trigger-width]">
                {Object.values(ServiceType)?.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">
            Scheduled Date & Time
          </Label>
          <DateTimePicker
            value={formik.values.scheduledDateTime}
            onChange={(iso) => formik.setFieldValue("scheduledDateTime", iso)}
            minDate={new Date().toISOString()}
          />
          {getFieldError("scheduledDateTime") && (
            <p className="text-xs text-destructive font-medium">
              {getFieldError("scheduledDateTime")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-slate-700">
          Job Details / Instructions
        </Label>
        <Textarea
          placeholder="Enter specific instructions for the driver..."
          className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 focus:bg-white transition-all"
          {...formik.getFieldProps("jobDetails")}
        />
      </div>
    </div>
  );
}
