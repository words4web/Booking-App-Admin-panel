"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/src/components/DateTimePicker";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { InvoiceSchema } from "@/src/schemas/validationSchemas";
import {
  InvoiceFormData,
  InvoiceLineFormData,
  Invoice,
} from "@/src/types/invoice.types";
import {
  TransactionType,
  InvoiceStatus,
  PaymentStatus,
} from "@/src/enums/invoice.enum";
import {
  useBookingsQuery,
  useBookingDetailsQuery,
} from "@/src/services/bookingManager/useBookingQueries";
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/src/services/invoiceManager/useInvoiceQueries";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Booking } from "@/src/types/booking.types";
import { InvoicePDFModal } from "./InvoicePDFModal";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Check, ChevronsUpDown } from "lucide-react";
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

function getBookingLabel(b: Booking): string {
  if (!b || !b._id) return "Unknown Booking";
  const c = b.clientId;
  const clientName =
    typeof c === "string"
      ? c
      : (c?.legalDetails?.legalName ??
        (c?.contactInfo
          ? `${c.contactInfo.firstName} ${c.contactInfo.lastName}`
          : "Client"));
  const dt = b.scheduledDateTime
    ? new Date(b.scheduledDateTime).toLocaleDateString("en-GB")
    : "No Date";
  return `${b.bookingId || "BK-????"} — ${clientName} (${dt})`;
}

const EMPTY_LINE: InvoiceLineFormData = {
  productId: "",
  description: "",

  quantity: 1,
  unitPrice: 0,
  vatPercent: 20,
};

interface LineComputedTotals {
  productTotal: number;
  subtotal: number;
  totalVat: number;
  totalAmount: number;
}

function computeTotals(
  lines: InvoiceLineFormData[],
  waitingTotal: number = 0,
  nightShiftAmount: number = 0,
): LineComputedTotals {
  let productTotal = 0;
  let totalVat = 0;
  lines.forEach((l) => {
    const qty = Number(l.quantity) || 0;
    const price = Number(l.unitPrice) || 0;
    const vat = Number(l.vatPercent) || 0;
    const exVat = qty * price;
    productTotal += exVat;
    totalVat += exVat * (vat / 100);
  });

  const subtotal = productTotal + waitingTotal + nightShiftAmount;
  const totalAmount = subtotal + totalVat;

  return { productTotal, subtotal, totalVat, totalAmount };
}

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  isEdit?: boolean;
  invoiceId?: string;
}

export function InvoiceForm({
  initialData,
  isEdit,
  invoiceId,
}: InvoiceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdFromUrl = searchParams.get("bookingId");

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [availableLogos] = useState<string[]>([
    "RKB-CCONCRETE-LTD-LOGO.png",
    "RKB-HAULAGE-LTD-LOGO.png",
  ]);
  const hasAutoselected = useRef(false);

  const bookingFilters = useMemo(
    () => ({
      search: debouncedSearch,
      limit: 50,
    }),
    [debouncedSearch],
  );

  const { data: bookingsData, isLoading: isLoadingBookings } =
    useBookingsQuery(bookingFilters);

  const { data: specificBookingData } = useBookingDetailsQuery(
    (isEdit ? initialData?.bookingId : bookingIdFromUrl) || "",
  );

  const availableBookings = useMemo(() => {
    let list = [...(bookingsData?.bookings ?? [])];
    const specific = specificBookingData;
    if (specific && !list.find((b) => b._id === specific._id)) {
      list.unshift(specific);
    }
    return list;
  }, [bookingsData, specificBookingData]);

  const createMutation = useCreateInvoiceMutation();
  const updateMutation = useUpdateInvoiceMutation(invoiceId || "");

  const defaultDate = useMemo(() => new Date().toISOString(), []);

  const memoizedInitialValues = useMemo<InvoiceFormData>(
    () => ({
      bookingId: initialData?.bookingId || bookingIdFromUrl || "",
      clientId: initialData?.clientId || "",
      companyId: initialData?.companyId || "",
      invoiceDate: initialData?.invoiceDate || defaultDate,
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : "",
      transactionType: TransactionType.SALES,
      status: initialData?.status || InvoiceStatus.DRAFT,
      paymentStatus: initialData?.paymentStatus || PaymentStatus.PENDING,
      lineItems: initialData?.lineItems || [EMPTY_LINE],
      billingName: initialData?.billingName || "",
      billingAddress: initialData?.billingAddress || "",
      companyAddress: initialData?.companyAddress || "",
      waitingMinutes: initialData?.waitingMinutes || 0,
      waitingTotal: initialData?.waitingTotal || 0,
      isNightShift: initialData?.isNightShift || false,
      nightShiftAmount: initialData?.nightShiftAmount || 0,
      notes: initialData?.notes || "",
      paymentLink: initialData?.paymentLink || "",
      terms:
        initialData?.terms ||
        "Late payment will be subject to a compensation payment, plus interest charged at 8% above the Bank Of England base rate.\nPayment should be made by bank transfer to the following account:\nAccount Name : RKB KENT Concrete Ltd\nSort Code: 60-06-33\nAccount No: 34965254\nName of Bank: Natwest",
      logoFile: initialData?.logoFile || "RKB-CCONCRETE-LTD-LOGO.png",
    }),
    [initialData, bookingIdFromUrl, defaultDate],
  );

  const formik = useFormik<InvoiceFormData>({
    initialValues: memoizedInitialValues,
    validationSchema: toFormikValidationSchema(InvoiceSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEdit && invoiceId) {
        updateMutation.mutate(values, {
          onSuccess: () => {
            router.push(ROUTES_PATH.INVOICES.BASE);
          },
        });
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            router.push(ROUTES_PATH.INVOICES.BASE);
          },
        });
      }
    },
  });

  const getFieldError = (name: string): string | null => {
    const error = formik.errors as any;
    const touched = formik.touched as any;

    let errVal: any;
    let touchVal: any;

    if (name.includes(".")) {
      const parts = name.split(".");
      errVal = error;
      touchVal = touched;
      for (const part of parts) {
        errVal = errVal?.[part];
        touchVal = touchVal?.[part];
      }
    } else {
      errVal = error[name];
      touchVal = touched[name];
    }

    // Strictly return only if it's a string and the field is touched
    if (typeof errVal === "string" && touchVal) {
      return errVal;
    }
    return null;
  };

  const handleSaveClick = async () => {
    formik.setTouched({
      bookingId: true,
      clientId: true,
      dueDate: true,
      invoiceDate: true,
      lineItems: formik.values.lineItems.map(() => ({
        description: true,
        quantity: true,
        unitPrice: true,
      })),
    });
    formik.handleSubmit();
  };

  const getExVat = useCallback(
    (l: InvoiceLineFormData) =>
      Number(l.quantity || 0) * Number(l.unitPrice || 0),
    [],
  );
  const getVatAmt = useCallback(
    (l: InvoiceLineFormData) => getExVat(l) * (Number(l.vatPercent || 0) / 100),
    [getExVat],
  );

  const totals = useMemo(
    () =>
      computeTotals(
        formik.values.lineItems,
        formik.values.waitingTotal,
        formik.values.nightShiftAmount,
      ),
    [
      formik.values.lineItems,
      formik.values.waitingTotal,
      formik.values.nightShiftAmount,
    ],
  );

  const { setFieldValue } = formik;

  const handleBookingSelect = useCallback(
    (bId: string) => {
      const b = availableBookings.find((x) => x._id === bId);
      if (!b) return;

      setFieldValue("bookingId", bId);
      setFieldValue(
        "clientId",
        typeof b.clientId === "string" ? b.clientId : b.clientId?._id || "",
      );
      setFieldValue(
        "companyId",
        typeof b.companyId === "string" ? b.companyId : b.companyId?._id || "",
      );

      const isClientVatExempt =
        typeof b.clientId !== "string" && (b.clientId as any)?.vatExempt;

      const lines: InvoiceLineFormData[] = (b.products || []).map((p) => ({
        productId:
          typeof p.productId === "string" ? p.productId : p.productId?._id,
        description: p.name,

        quantity: p.quantity,
        unitPrice: p.rate,
        vatPercent: isClientVatExempt ? 0 : 20,
      }));

      setFieldValue("lineItems", lines.length > 0 ? lines : [EMPTY_LINE]);

      // Auto-set waiting time as dedicated fields
      if (
        b.waitingTime &&
        typeof b.waitingTime.durationMinutes === "number" &&
        b.waitingTime.durationMinutes > 0
      ) {
        const hourlyRate = (b.products?.[0] as any)?.hourlyRate || 0;
        const durationHours = b.waitingTime.durationMinutes / 60;
        const waitCost = Number((durationHours * hourlyRate).toFixed(2));

        setFieldValue("waitingMinutes", b.waitingTime.durationMinutes);
        setFieldValue("waitingTotal", waitCost);
      } else {
        setFieldValue("waitingMinutes", 0);
        setFieldValue("waitingTotal", 0);
      }

      // Auto-populate address overrides
      const client = b.clientId as any;
      const company = b.companyId as any;

      if (client?.legalDetails?.legalName) {
        setFieldValue("billingName", client.legalDetails.legalName);
      }

      const clientAddrString = client?.address
        ? [
            client.address.addressLine1,
            client.address.addressLine2,
            client.address.city,
            client.address.county,
            client.address.postcode,
            client.address.country,
          ]
            .filter(Boolean)
            .join("\n")
        : "";
      setFieldValue("billingAddress", clientAddrString);

      const companyAddrString = company?.address
        ? [
            company.address.addressLine1,
            company.address.addressLine2,
            company.address.city,
            company.address.county,
            company.address.postcode,
            company.address.country,
          ]
            .filter(Boolean)
            .join("\n")
        : "RKB House\nWharf Road\nGravesend, Kent\nDA12 2RU";
      setFieldValue("companyAddress", companyAddrString);
    },
    [availableBookings, setFieldValue],
  );

  useEffect(() => {
    if (
      bookingIdFromUrl &&
      availableBookings.length > 0 &&
      !hasAutoselected.current
    ) {
      handleBookingSelect(bookingIdFromUrl);
      hasAutoselected.current = true;
    }
  }, [bookingIdFromUrl, availableBookings, handleBookingSelect]);

  const removeLine = (index: number) => {
    const newLines = [...formik.values.lineItems];
    newLines.splice(index, 1);
    formik.setFieldValue(
      "lineItems",
      newLines.length > 0 ? newLines : [EMPTY_LINE],
    );
  };

  const setLineField = (index: number, field: string, value: any) => {
    formik.setFieldValue(`lineItems[${index}].${field}`, value);
  };

  const previewInvoiceData = useMemo(() => {
    const selectedBooking = availableBookings.find(
      (b) => b._id === formik.values.bookingId,
    );
    const client = selectedBooking?.clientId as any;
    const company = selectedBooking?.companyId as any;

    // Custom Invoice ID Logic matching Backend
    let customInvoiceId = "DRAFT";
    if (selectedBooking?.bookingId) {
      const numericPart = selectedBooking.bookingId.replace(/^\D+/g, "");
      const prefix = company?.invoicePrefix || "RKB";
      customInvoiceId = prefix + (numericPart || "0001");
    }

    return {
      ...formik.values,
      invoiceNumber: customInvoiceId,
      clientId: client || formik.values.clientId,
      companyId: company || formik.values.companyId,
      // Pass overrides to preview
      billingName: formik.values.billingName,
      billingAddress: formik.values.billingAddress,
      companyAddress: formik.values.companyAddress,
      subtotal: totals.subtotal,
      totalVat: totals.totalVat,
      totalAmount: totals.totalAmount || 0,
      lineItems: formik.values.lineItems.map((l) => ({
        ...l,
        exVat: getExVat(l),
        vatAmt: getVatAmt(l),
        total: getExVat(l) + getVatAmt(l),
      })),
      taxBreakdown: [],
    } as unknown as Invoice;
  }, [formik.values, totals, availableBookings, getExVat, getVatAmt]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Top Bar */}
      <div className="max-w-full mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg hover:bg-gray-200">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Invoice" : "New Sale"}
          </h1>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 lg:p-8">
          {/* Logo Selection */}
          <div className="mb-6 flex gap-6 items-start">
            <div className="flex-1">
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Invoice Logo
              </Label>
              <Select
                value={formik.values.logoFile || "RKB-CCONCRETE-LTD-LOGO.png"}
                onValueChange={(v) => formik.setFieldValue("logoFile", v)}>
                <SelectTrigger className="w-full h-10 rounded-lg border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Select logo" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width] bg-white border border-gray-200">
                  {availableLogos.map((logo) => (
                    <SelectItem key={logo} value={logo}>
                      {logo
                        .replace(/\.(png|jpg|jpeg|svg|webp)$/i, "")
                        .replace(/-/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Logo Preview */}
            <div className="w-48 h-20 bg-gray-50 border border-gray-200 rounded-lg hidden sm:flex items-center justify-center p-2 overflow-hidden">
              {formik.values.logoFile ? (
                <img
                  src={`/${formik.values.logoFile}`}
                  alt="Logo Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://placehold.co/200x80?text=Preview+Error";
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">No Logo Selected</span>
              )}
            </div>
          </div>

          {/* Header Fields - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Date
              </Label>
              <DateTimePicker
                value={formik.values.invoiceDate}
                onChange={(iso: string) =>
                  formik.setFieldValue("invoiceDate", iso)
                }
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
                onValueChange={(v) =>
                  formik.setFieldValue("transactionType", v)
                }>
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

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6" />

          {/* Line Items */}
          <div className="space-y-4">
            {formik.values.lineItems.map((line, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                {/* Line header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Line {idx + 1}
                  </span>
                  {!isEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLine(idx)}
                      className="h-7 w-7 text-gray-400 hover:text-red-500 rounded-md">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Line fields - all on one row on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* Ex-VAT (Unit Price) */}
                  <div>
                    <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      Ex-VAT (£)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={line.unitPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLineField(idx, "unitPrice", Number(e.target.value))
                      }
                      className={cn(
                        "h-9 rounded-md border-gray-300 text-sm bg-white",
                        getFieldError(`lineItems.${idx}.unitPrice`) &&
                          "border-destructive",
                      )}
                    />
                    {getFieldError(`lineItems.${idx}.unitPrice`) && (
                      <p className="text-[10px] text-destructive font-medium mt-1">
                        {getFieldError(`lineItems.${idx}.unitPrice`)}
                      </p>
                    )}
                  </div>

                  {/* VAT Rate - editable as percentage */}
                  <div>
                    <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      VAT Rate (%)
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={line.vatPercent || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLineField(
                          idx,
                          "vatPercent",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="20"
                      className={cn(
                        "h-9 rounded-md border-gray-300 text-sm bg-white",
                        getFieldError(`lineItems.${idx}.vatPercent`) &&
                          "border-destructive",
                      )}
                    />
                    {getFieldError(`lineItems.${idx}.vatPercent`) && (
                      <p className="text-[10px] text-destructive font-medium mt-1">
                        {getFieldError(`lineItems.${idx}.vatPercent`)}
                      </p>
                    )}
                  </div>

                  {/* VAT Amount (auto-calculated, read-only) */}
                  <div>
                    <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      VAT (£)
                    </Label>
                    <div className="h-9 flex items-center px-3 text-sm text-gray-600 bg-gray-100 rounded-md border border-gray-200">
                      {Number(getVatAmt(line) || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.1"
                      value={line.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLineField(idx, "quantity", Number(e.target.value))
                      }
                      className={cn(
                        "h-9 rounded-md border-gray-300 text-sm bg-white",
                        getFieldError(`lineItems.${idx}.quantity`) &&
                          "border-destructive",
                      )}
                    />
                    {getFieldError(`lineItems.${idx}.quantity`) && (
                      <p className="text-[10px] text-destructive font-medium mt-1">
                        {getFieldError(`lineItems.${idx}.quantity`)}
                      </p>
                    )}
                  </div>

                  {/* Detail (Description) */}
                  <div>
                    <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      Detail
                    </Label>
                    <Input
                      placeholder="Description"
                      value={line.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLineField(idx, "description", e.target.value)
                      }
                      className={cn(
                        "h-9 rounded-md border-gray-300 text-sm bg-white",
                        getFieldError(`lineItems.${idx}.description`) &&
                          "border-destructive",
                      )}
                    />
                    {getFieldError(`lineItems.${idx}.description`) && (
                      <p className="text-[10px] text-destructive font-medium mt-1">
                        {getFieldError(`lineItems.${idx}.description`)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-6 mb-6" />

          {/* Payment Breakdown */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product Total</span>
                <span className="font-semibold text-gray-900">
                  £{Number(totals.productTotal || 0).toFixed(2)}
                </span>
              </div>

              {/* Waiting Time Section */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Waiting Time
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-400">
                      Minutes
                    </Label>
                    <Input
                      type="number"
                      value={formik.values.waitingMinutes || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue(
                          "waitingMinutes",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0"
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400">
                      Cost (£)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formik.values.waitingTotal || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue(
                          "waitingTotal",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                      className="h-8 text-xs bg-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Night Shift Section */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Night Shift
                  </span>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-slate-400">Apply</Label>
                    <input
                      type="checkbox"
                      checked={formik.values.isNightShift || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        formik.setFieldValue("isNightShift", checked);
                        if (!checked) {
                          formik.setFieldValue("nightShiftAmount", 0);
                        } else if (
                          !formik.values.nightShiftAmount ||
                          Number(formik.values.nightShiftAmount) === 0
                        ) {
                          formik.setFieldValue("nightShiftAmount", 2);
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {formik.values.isNightShift && (
                  <div className="grid grid-cols-1 mt-2">
                    <div>
                      <Label className="text-[10px] text-slate-400">
                        Amount (£)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formik.values.nightShiftAmount || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          formik.setFieldValue(
                            "nightShiftAmount",
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                        placeholder="0.00"
                        className="h-8 text-xs bg-white font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                <span className="text-gray-500 font-bold text-xs uppercase">
                  Subtotal
                </span>
                <span className="font-bold text-gray-900">
                  £{Number(totals.subtotal || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (20%)</span>
                <span className="font-semibold text-gray-900">
                  £{Number(totals.totalVat || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="text-sm font-bold text-gray-900">
                  Total Including VAT
                </span>
                <span className="text-lg font-bold text-gray-900">
                  £{Number(totals.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-6 mb-6" />

          {/* Notes & Terms */}
          <div className="mb-6">
            <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Terms & Conditions
            </Label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Add payment terms or conditions..."
              {...formik.getFieldProps("terms")}
            />
          </div>

          {/* Billing & Company Detail Overrides */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Address & Billing Details (Overrides)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Bill To: Legal Name
                  </Label>
                  <Input
                    placeholder="Client Legal Name"
                    {...formik.getFieldProps("billingName")}
                    className="h-10 rounded-lg border-gray-300 bg-white text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Bill To: Full Address
                  </Label>
                  <textarea
                    className="w-full min-h-[80px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter full billing address..."
                    {...formik.getFieldProps("billingAddress")}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    From: Company Address
                  </Label>
                  <textarea
                    className="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter full company address..."
                    {...formik.getFieldProps("companyAddress")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(ROUTES_PATH.INVOICES.BASE)}
              className="h-11 px-6 rounded-xl text-slate-600 hover:text-slate-900 font-semibold">
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="h-10 px-8 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium shadow-sm text-sm">
              {createMutation.isPending || updateMutation.isPending ? (
                <CommonLoader />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  {isEdit ? "Update" : "Save"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <InvoicePDFModal
        invoice={previewInvoiceData}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
