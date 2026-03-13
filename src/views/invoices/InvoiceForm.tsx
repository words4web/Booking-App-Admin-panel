"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useDebounce } from "@/src/hooks/useDebounce";
import { InvoiceFormHeader } from "./components/InvoiceFormHeader";
import { InvoiceFormBookingSection } from "./components/InvoiceFormBookingSection";
import { InvoiceFormLineItems } from "./components/InvoiceFormLineItems";
import { InvoiceFormTotals } from "./components/InvoiceFormTotals";
import { InvoiceFormTerms } from "./components/InvoiceFormTerms";
import { InvoicePDFModal } from "./InvoicePDFModal";

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
          {/* Logo Selection & Header */}
          <InvoiceFormHeader formik={formik} availableLogos={availableLogos} />
          {/* Booking & Dates */}
          <InvoiceFormBookingSection
            formik={formik}
            getFieldError={getFieldError}
            open={open}
            setOpen={setOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoadingBookings={isLoadingBookings}
            availableBookings={availableBookings}
            handleBookingSelect={handleBookingSelect}
            getBookingLabel={getBookingLabel}
            previewInvoiceData={previewInvoiceData}
          />
          {/* Divider */}
          <div className="border-t border-gray-200 mb-6" />
          {/* Line Items */}
          <InvoiceFormLineItems
            formik={formik}
            isEdit={!!isEdit}
            getFieldError={getFieldError}
            removeLine={removeLine}
            setLineField={setLineField}
            getVatAmt={getVatAmt}
          />
          {/* Divider */}
          <div className="border-t border-gray-200 mt-6 mb-6" />
          {/* Payment Breakdown / Totals */}
          <InvoiceFormTotals formik={formik} totals={totals as any} />
          {/* Divider */}
          <div className="border-t border-gray-200 mt-6 mb-6" />
          {/* Notes, Terms & Overrides */}
          <InvoiceFormTerms formik={formik} />
          <div className="flex items-center justify-end gap-3 mt-8">
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
