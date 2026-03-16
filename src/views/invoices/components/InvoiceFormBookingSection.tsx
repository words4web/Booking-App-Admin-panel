import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { InvoiceFormData, Invoice } from "@/src/types/invoice.types";
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
  previewInvoiceData: Invoice;
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
  previewInvoiceData,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Date
          </Label>
          <DateTimePicker
            value={formik.values.invoiceDate}
            onChange={(iso: string) => formik.setFieldValue("invoiceDate", iso)}
            className={cn(
              "h-10 rounded-lg border-gray-300 bg-white text-sm",
              getFieldError("invoiceDate") && "border-destructive",
            )}
          />
          {getFieldError("invoiceDate") && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {getFieldError("invoiceDate")}
            </p>
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Selected Booking
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "h-10 w-full justify-between rounded-lg border-gray-300 bg-white text-sm font-normal overflow-hidden",
                  getFieldError("bookingId") && "border-destructive",
                )}>
                <span className="truncate">
                  {formik.values.bookingId
                    ? getBookingLabel(
                        availableBookings.find(
                          (b) => b._id === formik.values.bookingId,
                        ) as Booking,
                      )
                    : "Select Booking"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search booking ID or client..."
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
                        key={b._id}
                        value={b._id}
                        onSelect={(currentValue) => {
                          handleBookingSelect(currentValue);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formik.values.bookingId === b._id
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
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Transaction Type
          </Label>
          <Select
            value={formik.values.transactionType}
            onValueChange={(v) => formik.setFieldValue("transactionType", v)}>
            <SelectTrigger className="h-10 rounded-lg border-gray-300 bg-white text-sm w-full">
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
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Invoice Number
          </Label>
          <Input
            value={
              formik.values.bookingId
                ? `#${previewInvoiceData.invoiceNumber}`
                : "PENDING SELECTION"
            }
            disabled
            className="h-10 rounded-lg border-gray-200 bg-gray-50 text-gray-500 font-bold text-sm"
          />
        </div>
      </div>

      {/* Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Due Date
          </Label>
          <DateTimePicker
            value={formik.values.dueDate || ""}
            onChange={(iso: string) => formik.setFieldValue("dueDate", iso)}
            minDate={formik.values.invoiceDate}
            className={cn(
              "h-10 rounded-lg border-gray-300 bg-white text-sm",
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
