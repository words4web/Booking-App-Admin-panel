"use client";

import { useState } from "react";
import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { ServiceType } from "@/src/enums/booking.enum";
import { UserRoles } from "@/src/enums/roles.enum";
import { Company } from "@/src/types/company.types";
import { Info, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  useAllClientsQuery,
  useClientDetailsQuery,
} from "@/src/services/clientManager/useClientQueries";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  initialClient?: any;
  getFieldError: (name: string) => string | null;
  companies?: Company[];
  userRole?: UserRoles;
  onCompanyChange: (companyId: string) => void;
}

export function DetailsTab({
  formik,
  initialClient,
  getFieldError,
  companies,
  userRole,
  onCompanyChange,
}: DetailsTabProps) {
  const isSuperAdmin = userRole === UserRoles.SUPER_ADMIN;
  const [openClient, setOpenClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: clientsData, isLoading: isClientsLoading } = useAllClientsQuery(
    {
      companyId: formik.values.companyId,
      search: debouncedSearchTerm || undefined,
      limit: 20,
    },
    {
      enabled: !!debouncedSearchTerm && !!formik.values.companyId,
    },
  );

  const clients = clientsData?.clients || [];

  const getClientDisplayName = (client: any) => {
    if (!client) return "Unknown Client";
    const name =
      `${client?.contactInfo?.firstName || ""} ${client?.contactInfo?.lastName || ""}`.trim();
    if (client?.legalDetails?.legalName) {
      return name
        ? `${client?.legalDetails.legalName} (${name})`
        : client?.legalDetails.legalName;
    }
    return name || client?.email || "Unknown Client";
  };

  const { data: selectedClientData } = useClientDetailsQuery(
    formik.values.clientId,
  );

  // If the selected client is in the search results, use that.
  // Otherwise, if we have an initialClient, display its name.
  let displayValue = "Search for a client...";
  if (formik.values.clientId) {
    const found =
      clients?.find((c) => c?._id === formik.values.clientId) ||
      selectedClientData;
    if (found) displayValue = getClientDisplayName(found);
    else if (
      initialClient &&
      (initialClient?._id === formik.values.clientId ||
        initialClient === formik.values.clientId)
    ) {
      displayValue =
        typeof initialClient === "object"
          ? getClientDisplayName(initialClient)
          : "Selected Client";
    } else {
      displayValue = "Selected Client";
    }
  }

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
                    <SelectItem key={company?._id} value={company?._id}>
                      {company?.name}
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
            <Popover open={openClient} onOpenChange={setOpenClient}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClient}
                  disabled={!formik.values.companyId}
                  className={cn(
                    "w-full h-12 justify-between rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white transition-all font-normal",
                    !formik.values.clientId && "text-muted-foreground",
                    getFieldError("clientId") && "border-destructive",
                  )}>
                  {!formik.values.companyId
                    ? "Select a company first"
                    : displayValue}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl"
                align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search client by name or email..."
                    className="h-11 border-none focus:ring-0"
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    {!debouncedSearchTerm && clients?.length === 0 && (
                      <div className="p-4 text-sm text-slate-500 text-center">
                        Type to search for clients...
                      </div>
                    )}
                    {isClientsLoading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                    {!isClientsLoading &&
                      debouncedSearchTerm &&
                      clients?.length === 0 && (
                        <CommandEmpty>No clients found.</CommandEmpty>
                      )}
                    <CommandGroup>
                      {clients?.map((client) => {
                        const displayName = getClientDisplayName(client);
                        return (
                          <CommandItem
                            key={client?._id}
                            value={client?._id}
                            onSelect={() => {
                              formik.setFieldValue("clientId", client?._id);

                              if (
                                formik.values.serviceType !==
                                  ServiceType.HAULAGE &&
                                client?.address?.addressLine1
                              ) {
                                formik.setFieldValue("dropLocation", {
                                  addressLine1:
                                    client?.address?.addressLine1 || "",
                                  addressLine2:
                                    client?.address?.addressLine2 || "",
                                  city: client?.address?.city || "",
                                  county: client?.address?.county || "",
                                  postcode: client?.address?.postcode || "",
                                });
                              }

                              setOpenClient(false);
                            }}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formik.values.clientId === client?._id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {displayName}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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

        <div className="col-span-1 grid grid-cols-1 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">
              Scheduled Time
            </Label>
            <DateTimePicker
              value={formik.values.scheduledDateTime}
              onChange={(iso) => formik.setFieldValue("scheduledDateTime", iso)}
            />
            {getFieldError("scheduledDateTime") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("scheduledDateTime")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">
              Completion Time
            </Label>
            <DateTimePicker
              value={formik.values.endTime || ""}
              onChange={(iso) => formik.setFieldValue("endTime", iso)}
            />
            {getFieldError("endTime") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("endTime")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-bold text-slate-700">
            Job Details / Instructions
          </Label>
          <div className="group relative flex items-center">
            <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-slate-800 text-white text-xs rounded-md shadow-lg z-10 p-2 text-center pointer-events-none">
              This will only be visible to the driver
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] border-[5px] border-transparent border-t-slate-800 pointer-events-none"></div>
            </div>
          </div>
        </div>
        <Textarea
          placeholder="Enter specific instructions for the driver..."
          className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 focus:bg-white transition-all"
          {...formik.getFieldProps("jobDetails")}
        />
      </div>
    </div>
  );
}
