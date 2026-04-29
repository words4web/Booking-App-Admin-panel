import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/src/components/DateTimePicker";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/src/enums/invoice.enum";
import { FormikProps } from "formik";
import { InvoiceFormData } from "@/src/types/invoice.types";
import { Booking } from "@/src/types/booking.types";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface InvoiceFormBookingSectionProps {
  formik: FormikProps<InvoiceFormData>;
  getFieldError: (name: string) => string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoadingBookings: boolean;
  availableBookings: Booking[];
  handleBookingSelect: (bId: string) => void;
  getBookingLabel: (b: Booking) => string;
  initialBooking?: Booking;
  // Client selector (standalone mode)
  clientOpen: boolean;
  setClientOpen: (open: boolean) => void;
  clientSearchTerm: string;
  setClientSearchTerm: (term: string) => void;
  isLoadingClients: boolean;
  availableClients: any[];
  initialClient?: any;
  handleClientSelect: (cId: string) => void;
  handleClearBooking: () => void;
  handleClearClient: () => void;
}

export const InvoiceFormBookingSection: React.FC<
  InvoiceFormBookingSectionProps
> = ({
  formik,
  getFieldError,
  open,
  setOpen,
  searchTerm,
  setSearchTerm,
  isLoadingBookings,
  availableBookings,
  handleBookingSelect,
  getBookingLabel,
  initialBooking,
  clientOpen,
  setClientOpen,
  clientSearchTerm,
  setClientSearchTerm,
  isLoadingClients,
  availableClients,
  initialClient,
  handleClientSelect,
  handleClearBooking,
  handleClearClient,
}) => {
  const isBookingMode = !!formik.values.bookingId;
  const isStandaloneMode = !!formik.values.clientId && !isBookingMode;

  const selectedClient =
    availableClients?.find((c: any) => c?._id === formik.values.clientId) ||
    (typeof initialClient === "object" &&
    initialClient?._id === formik.values.clientId
      ? initialClient
      : null);

  const clientLabel = selectedClient
    ? selectedClient?.legalDetails?.legalName ||
      `${selectedClient?.contactInfo?.firstName || ""} ${selectedClient?.contactInfo?.lastName || ""}`.trim() ||
      "Client"
    : "Select Client";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div>
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Invoice Date
          </Label>
          <DateTimePicker
            value={formik.values.invoiceDate}
            onChange={(iso: string) => formik.setFieldValue("invoiceDate", iso)}
            className={cn(
              "h-11 sm:h-10 rounded-lg border-gray-300 bg-white text-sm",
              getFieldError("invoiceDate") && "border-destructive",
            )}
          />
          {getFieldError("invoiceDate") && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {getFieldError("invoiceDate")}
            </p>
          )}
        </div>

        {/* Booking Selector (Optional) */}
        <div>
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Select Booking{" "}
            <span className="normal-case font-normal text-gray-400">
              (optional)
            </span>
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={isStandaloneMode}
                className={cn(
                  "h-11 sm:h-10 w-full justify-between rounded-lg border-gray-300 bg-white text-sm font-normal overflow-hidden",
                  getFieldError("bookingId") && "border-destructive",
                  isStandaloneMode && "opacity-60 cursor-not-allowed",
                )}>
                <span className="truncate">
                  {formik.values.bookingId
                    ? getBookingLabel(
                        (availableBookings?.find(
                          (b) => b?._id === formik.values?.bookingId,
                        ) ||
                          (initialBooking?._id === formik.values.bookingId
                            ? initialBooking
                            : null)) as Booking,
                      )
                    : "Select Booking"}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {formik.values?.bookingId && (
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearBooking();
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                      <span className="text-lg leading-none">×</span>
                    </div>
                  )}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search booking..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  {isLoadingBookings && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  )}
                  <CommandEmpty>No bookings found.</CommandEmpty>
                  <CommandGroup>
                    {availableBookings?.map((b) => (
                      <CommandItem
                        key={b?._id}
                        value={b?._id}
                        onSelect={(currentValue) => {
                          handleBookingSelect(currentValue);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formik.values.bookingId === b?._id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getBookingLabel(b)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {getFieldError("bookingId") && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {getFieldError("bookingId")}
            </p>
          )}
        </div>

        {/* Client Selector (standalone mode — required when no booking) */}
        <div>
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Client{" "}
            <span className="normal-case font-normal text-gray-400">
              {formik.values.bookingId
                ? "(auto-set from booking)"
                : "(required)"}
            </span>
          </Label>
          <Popover open={clientOpen} onOpenChange={setClientOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientOpen}
                disabled={isBookingMode}
                className={cn(
                  "h-11 sm:h-10 w-full justify-between rounded-lg border-gray-300 bg-white text-sm font-normal overflow-hidden",
                  getFieldError("clientId") && "border-destructive",
                  isBookingMode && "opacity-60 cursor-not-allowed",
                )}>
                <span className="truncate">{clientLabel}</span>
                <div className="flex items-center gap-1 ml-2">
                  {formik.values.clientId && !isBookingMode && (
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearClient();
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                      <span className="text-lg leading-none">×</span>
                    </div>
                  )}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search client..."
                  value={clientSearchTerm}
                  onValueChange={setClientSearchTerm}
                />
                <CommandList>
                  {isLoadingClients && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  )}
                  <CommandEmpty>No clients found.</CommandEmpty>
                  <CommandGroup>
                    {availableClients?.map((c: any) => (
                      <CommandItem
                        key={c?._id}
                        value={c?._id}
                        onSelect={(val) => {
                          handleClientSelect(val);
                          setClientOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formik.values.clientId === c?._id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {c?.legalDetails?.legalName ||
                          `${c?.contactInfo?.firstName || ""} ${c?.contactInfo?.lastName || ""}`?.trim() ||
                          "Unnamed Client"}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {getFieldError("clientId") && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {getFieldError("clientId")}
            </p>
          )}
        </div>

        <div>
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Type
          </Label>
          <Select
            value={formik.values.transactionType}
            onValueChange={(v) => formik.setFieldValue("transactionType", v)}>
            <SelectTrigger className="h-11 sm:h-10 rounded-lg border-gray-300 bg-white text-sm w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white border border-gray-200 shadow-lg w-[--radix-select-trigger-width]">
              <SelectItem value={TransactionType.SALES}>Sale</SelectItem>
              <SelectItem value={TransactionType.CREDIT_NOTE}>
                Credit Note
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Due Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div>
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Due Date
          </Label>
          <DateTimePicker
            value={formik.values.dueDate || ""}
            onChange={(iso: string) => formik.setFieldValue("dueDate", iso)}
            minDate={formik.values.invoiceDate}
            className={cn(
              "h-11 sm:h-10 rounded-lg border-gray-300 bg-white text-sm",
              getFieldError("dueDate") && "border-destructive",
            )}
          />
          {getFieldError("dueDate") && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {getFieldError("dueDate")}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
