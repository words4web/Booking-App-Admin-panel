"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ArrowLeft, Save, AlertTriangle, Send } from "lucide-react";
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
import {
  useAllClientsQuery,
  useClientDetailsQuery,
} from "@/src/services/clientManager/useClientQueries";
import { useCompanyDetailsQuery } from "@/src/services/companyManager/useCompanyQueries";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Booking } from "@/src/types/booking.types";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAllProductsQuery } from "@/src/services/productManager/useProductQueries";
import { InvoiceFormHeader } from "./components/InvoiceFormHeader";
import { InvoiceFormBookingSection } from "./components/InvoiceFormBookingSection";
import { InvoiceFormLineItems } from "./components/InvoiceFormLineItems";
import { InvoiceFormTotals } from "./components/InvoiceFormTotals";
import { InvoiceFormTerms } from "./components/InvoiceFormTerms";
import { InvoicePDFModal } from "./InvoicePDFModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getBookingLabel(b: Booking): string {
  if (!b || !b._id) return "Unknown Booking";
  const c = b.clientId;
  const clientName =
    typeof c === "string"
      ? c
      : (c?.legalDetails?.legalName ??
        (`${c?.contactInfo?.firstName || ""} ${c?.contactInfo?.lastName || ""}`.trim() ||
          "Client"));
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
  extraCharges: { label: string; amount: number }[] = [],
): LineComputedTotals {
  let productTotal = 0;
  lines.forEach((l) => {
    const qty = Number(l.quantity) || 0;
    const price = Number(l.unitPrice) || 0;
    productTotal += qty * price;
  });

  const extraChargesSum = extraCharges.reduce(
    (acc, charge) => acc + (Number(charge.amount) || 0),
    0,
  );

  const subtotal =
    productTotal + waitingTotal + nightShiftAmount + extraChargesSum;

  // VAT is applied on the full subtotal using the first line's vatPercent
  const globalVatPercent = lines[0]?.vatPercent ?? 0;
  const totalVat = subtotal * (globalVatPercent / 100);
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
  const [clientOpen, setClientOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedClientSearch = useDebounce(clientSearchTerm, 300);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [availableLogos] = useState<string[]>([
    "RKB-CONCRETE-LTD-LOGO.png",
    "RKB-HAULAGE-LTD-LOGO.png",
    "RKB-UNIQUE-HAULAGE-LTD-LOGO.png",
  ]);
  const hasAutoselected = useRef(false);
  const shouldAutofillCompany = useRef(!initialData?.companyName);

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
    if (specific && !list.find((b) => b?._id === specific?._id)) {
      list.unshift(specific);
    }
    return list;
  }, [bookingsData, specificBookingData]);

  const { data: clientsData, isLoading: isLoadingClients } = useAllClientsQuery(
    { search: debouncedClientSearch, limit: 50 },
  );

  const { data: productsData } = useAllProductsQuery({ getAll: true });
  const products = productsData?.products || [];

  const createMutation = useCreateInvoiceMutation();
  const updateMutation = useUpdateInvoiceMutation(invoiceId || "");

  const defaultDate = useMemo(() => new Date().toISOString(), []);

  const memoizedInitialValues = useMemo<InvoiceFormData>(
    () => ({
      bookingId:
        typeof initialData?.bookingId === "string"
          ? initialData?.bookingId
          : (initialData?.bookingId as any)?._id || bookingIdFromUrl || "",
      clientId:
        typeof initialData?.clientId === "string"
          ? initialData?.clientId
          : (initialData?.clientId as any)?._id || "",
      companyId:
        typeof initialData?.companyId === "string"
          ? initialData?.companyId
          : (initialData?.companyId as any)?._id || "",
      invoiceDate: initialData?.invoiceDate
        ? new Date(initialData.invoiceDate).toISOString()
        : defaultDate,
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString()
        : "",
      transactionType: initialData?.transactionType || TransactionType.SALES,
      status: initialData?.status || InvoiceStatus.DRAFT,
      paymentStatus: initialData?.paymentStatus || PaymentStatus.PENDING,
      lineItems:
        initialData?.lineItems?.map((l) => ({
          ...l,
          productId:
            typeof l?.productId === "string"
              ? l?.productId
              : (l?.productId as any)?._id || "",
        })) || [],
      billingName: initialData?.billingName || "",
      billingAddress: initialData?.billingAddress || "",
      companyAddress:
        initialData?.companyAddress ||
        "RKB House\nWharf Road\nGravesend, Kent\nDA12 2RU",
      companyName:
        initialData?.companyName ||
        (initialData?.companyId as any)?.name ||
        "RKB KENT CONCRETE LTD",
      companyTelephone:
        initialData?.companyTelephone ||
        (initialData?.companyId as any)?.telephone ||
        "+44-7956409828",
      companyEmail:
        initialData?.companyEmail ||
        (initialData?.companyId as any)?.adminEmail ||
        "rkbkentconcrete@gmail.com",
      companyVatNumber:
        initialData?.companyVatNumber ||
        (initialData?.companyId as any)?.vatNumber ||
        "499 4540 35",
      waitingMinutes: initialData?.waitingMinutes || 0,
      waitingTotal: initialData?.waitingTotal || 0,
      isNightShift: initialData?.isNightShift || false,
      nightShiftAmount: initialData?.nightShiftAmount || 0,
      extraCharges: initialData?.extraCharges || [],
      notes: initialData?.notes || "",
      paymentLink: initialData?.paymentLink || "",
      terms:
        initialData?.terms ||
        "Late payment will be subject to a compensation payment, plus interest charged at 8% above the Bank Of England base rate.\nPayment should be made by bank transfer to the following account:\nAccount Name : RKB KENT Concrete Ltd\nSort Code: 60-06-33\nAccount No: 34965254\nName of Bank: Natwest",
      logoFile: initialData?.logoFile || "RKB-CONCRETE-LTD-LOGO.png",
      invoiceNumber: (initialData as any)?.invoiceNumber || "",
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

  const { data: specificClientData } = useClientDetailsQuery(
    formik.values?.clientId || "",
  );

  const { data: companyDetails } = useCompanyDetailsQuery(
    formik.values?.companyId || "",
  );

  useEffect(() => {
    if (shouldAutofillCompany.current && companyDetails) {
      formik.setFieldValue(
        "companyName",
        companyDetails?.name || "RKB KENT CONCRETE LTD",
      );
      formik.setFieldValue(
        "companyTelephone",
        companyDetails?.telephone || "+44-7956409828",
      );
      formik.setFieldValue(
        "companyEmail",
        companyDetails?.adminEmail || "rkbkentconcrete@gmail.com",
      );
      formik.setFieldValue(
        "companyVatNumber",
        companyDetails?.vatNumber || "499 4540 35",
      );

      const companyAddrString = companyDetails?.address
        ? [
            companyDetails?.address.addressLine1,
            companyDetails?.address.addressLine2,
            companyDetails?.address.city,
            companyDetails?.address.postcode,
            companyDetails?.address.country,
          ]
            ?.filter(Boolean)
            ?.join("\n")
        : "RKB House\nWharf Road\nGravesend, Kent\nDA12 2RU";
      formik.setFieldValue("companyAddress", companyAddrString);

      shouldAutofillCompany.current = false;
    }
  }, [companyDetails, formik.setFieldValue]);

  const availableClients = useMemo(() => {
    let list = [...(clientsData?.clients ?? [])];
    const specific = specificClientData;
    if (specific && !list?.find((c: any) => c?._id === specific?._id)) {
      list.unshift(specific);
    }
    return list;
  }, [clientsData, specificClientData]);

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
    const errors = await formik.validateForm();
    if (Object.keys(errors)?.length === 0) {
      setIsConfirmModalOpen(true);
    } else {
      formik.handleSubmit();
    }
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
        formik.values.extraCharges,
      ),
    [
      formik.values.lineItems,
      formik.values.waitingTotal,
      formik.values.nightShiftAmount,
      formik.values.extraCharges,
    ],
  );

  const { setFieldValue } = formik;

  const handleBookingSelect = useCallback(
    (bId: string) => {
      const b = availableBookings?.find((x) => x?._id === bId);
      if (!b) return;

      setFieldValue("bookingId", bId);
      setFieldValue(
        "clientId",
        typeof b?.clientId === "string" ? b?.clientId : b?.clientId?._id || "",
      );
      setFieldValue(
        "companyId",
        typeof b?.companyId === "string"
          ? b?.companyId
          : b?.companyId?._id || "",
      );

      const lines: InvoiceLineFormData[] = [];
      (b?.products || [])?.forEach((p: any) => {
        lines.push({
          productId:
            typeof p?.productId === "string" ? p?.productId : p?.productId?._id,
          description: p?.name,
          quantity: p?.quantity,
          unitPrice: p?.rate,
          vatPercent: 20,
        });
      });

      const extraChargesArr: { label: string; amount: number }[] = [];
      (b?.products || [])?.forEach((p: any) => {
        const pExtraCharges = p?.extraCharges || p?.productId?.extraCharges;
        if (Array.isArray(pExtraCharges)) {
          pExtraCharges?.forEach((ec: any) => {
            if (ec?.label && ec?.amount) {
              extraChargesArr.push({ label: ec?.label, amount: ec?.amount });
            }
          });
        }
      });

      setFieldValue("lineItems", lines?.length > 0 ? lines : [EMPTY_LINE]);
      setFieldValue("extraCharges", extraChargesArr);

      if (
        b?.waitingTime &&
        typeof b?.waitingTime?.durationMinutes === "number" &&
        b?.waitingTime?.durationMinutes > 0
      ) {
        const hourlyRate = (b?.products?.[0] as any)?.hourlyRate || 0;
        const durationHours = b?.waitingTime?.durationMinutes / 60;
        const waitCost = Number((durationHours * hourlyRate).toFixed(2));
        setFieldValue("waitingMinutes", b?.waitingTime?.durationMinutes);
        setFieldValue("waitingTotal", waitCost);
      } else {
        setFieldValue("waitingMinutes", 0);
        setFieldValue("waitingTotal", 0);
      }

      const client = b?.clientId as any;
      const company = b?.companyId as any;
      if (client?.legalDetails?.legalName) {
        setFieldValue("billingName", client?.legalDetails?.legalName);
      }
      const clientAddrString = client?.address
        ? [
            client?.address?.addressLine1,
            client?.address?.addressLine2,
            client?.address?.city,
            client?.address?.county,
            client?.address?.postcode,
            client?.address?.country,
          ]
            ?.filter(Boolean)
            ?.join("\n")
        : "";
      setFieldValue("billingAddress", clientAddrString);
      const companyAddrString = company?.address
        ? [
            company?.address?.addressLine1,
            company?.address?.addressLine2,
            company?.address?.city,
            company?.address?.county,
            company?.address?.postcode,
            company?.address?.country,
          ]
            ?.filter(Boolean)
            ?.join("\n")
        : "RKB House\nWharf Road\nGravesend, Kent\nDA12 2RU";
      setFieldValue("companyAddress", companyAddrString);
      setFieldValue("companyName", company?.name || "");
      setFieldValue("companyTelephone", company?.telephone || "");
      setFieldValue("companyEmail", company?.adminEmail || "");
      setFieldValue("companyVatNumber", company?.vatNumber || "");
    },
    [availableBookings, setFieldValue],
  );

  // Standalone client select (no booking)
  const handleClientSelect = useCallback(
    (cId: string) => {
      const c = availableClients?.find((x: any) => x?._id === cId);
      if (!c) return;
      setFieldValue("clientId", cId);
      const compId = c?.companyId;
      setFieldValue(
        "companyId",
        typeof compId === "string" ? compId : compId?._id || "",
      );
      setFieldValue("bookingId", ""); // clear booking when picking client directly

      // Reset financial fields to defaults for standalone mode
      setFieldValue("lineItems", []);
      setFieldValue("extraCharges", []);
      setFieldValue("waitingMinutes", 0);
      setFieldValue("waitingTotal", 0);

      if (c?.legalDetails?.legalName) {
        setFieldValue("billingName", c?.legalDetails?.legalName);
      }

      // Set Billing Address
      const addrString = c?.address
        ? [
            c?.address?.addressLine1,
            c?.address?.addressLine2,
            c?.address?.city,
            c?.address?.county,
            c?.address?.postcode,
            c?.address?.country,
          ]
            ?.filter(Boolean)
            ?.join("\n")
        : "";
      setFieldValue("billingAddress", addrString);

      // Set Company Address (Fallback to standard if company details aren't fully populated in client list)
      const company = typeof compId === "object" ? (compId as any) : null;
      if (company) {
        setFieldValue("companyName", company?.name || "");
        setFieldValue("companyTelephone", company?.telephone || "");
        setFieldValue("companyEmail", company?.adminEmail || "");
        setFieldValue("companyVatNumber", company?.vatNumber || "");
      } else {
        setFieldValue("companyName", "");
        setFieldValue("companyTelephone", "");
        setFieldValue("companyEmail", "");
        setFieldValue("companyVatNumber", "");
      }

      const companyAddrString = c?.address
        ? c?.address?.country
        : "RKB House\nWharf Road\nGravesend, Kent\nDA12 2RU";
      setFieldValue("companyAddress", companyAddrString);
      shouldAutofillCompany.current = true;
    },
    [availableClients, setFieldValue],
  );

  const handleClearBooking = useCallback(() => {
    setFieldValue("bookingId", "");
    setFieldValue("clientId", "");
    setFieldValue("companyId", "");
    setFieldValue("billingName", "");
    setFieldValue("billingAddress", "");
    setFieldValue("companyAddress", "");
    setFieldValue("companyName", "");
    setFieldValue("companyTelephone", "");
    setFieldValue("companyEmail", "");
    setFieldValue("companyVatNumber", "");
    setFieldValue("lineItems", []);
    setFieldValue("extraCharges", []);
    setFieldValue("waitingMinutes", 0);
    setFieldValue("waitingTotal", 0);
  }, [setFieldValue]);

  const handleClearClient = useCallback(() => {
    setFieldValue("clientId", "");
    setFieldValue("billingName", "");
    setFieldValue("billingAddress", "");
    setFieldValue("companyAddress", "");
    setFieldValue("companyName", "");
    setFieldValue("companyTelephone", "");
    setFieldValue("companyEmail", "");
    setFieldValue("companyVatNumber", "");
    setFieldValue("lineItems", []);
    setFieldValue("companyId", "");
  }, [setFieldValue]);

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
    newLines?.splice(index, 1);
    formik.setFieldValue("lineItems", newLines);
  };

  const setLineField = (index: number, field: string, value: any) => {
    formik.setFieldValue(`lineItems[${index}].${field}`, value);
  };

  const previewInvoiceData = useMemo(() => {
    const selectedBooking = availableBookings?.find(
      (b) => b?._id === formik.values.bookingId,
    );
    const bookingClient = selectedBooking?.clientId as any;
    const bookingCompany = selectedBooking?.companyId as any;
    // Fallback to standalone client if no booking is selected
    const standaloneClient = availableClients?.find(
      (c: any) => c?._id === formik.values.clientId,
    ) as any;
    const client = bookingClient || standaloneClient;
    const company = bookingCompany || (standaloneClient?.companyId as any);

    let customInvoiceId = formik.values.invoiceNumber || "DRAFT";

    if (!formik.values.invoiceNumber) {
      const prefix = company?.invoicePrefix || "RKB";
      if (selectedBooking?.bookingId) {
        const numericPart = selectedBooking?.bookingId?.replace(/^\D+/g, "");
        customInvoiceId = prefix + (numericPart || "0001");
      } else if (client) {
        customInvoiceId = `${prefix}-DRAFT`;
      }
    }

    return {
      ...formik.values,
      invoiceNumber: customInvoiceId,
      clientId: client || formik.values.clientId,
      companyId: company || formik.values.companyId,
      billingName: formik.values.billingName,
      billingAddress: formik.values.billingAddress,
      companyAddress: formik.values.companyAddress,
      subtotal: totals.subtotal,
      totalVat: totals.totalVat,
      totalAmount: totals.totalAmount || 0,
      lineItems: formik.values.lineItems?.map((l) => ({
        ...l,
        exVat: getExVat(l),
        vatAmt: getVatAmt(l),
        total: getExVat(l) + getVatAmt(l),
      })),
      taxBreakdown: [],
    } as unknown as Invoice;
  }, [
    formik.values,
    totals,
    availableBookings,
    availableClients,
    getExVat,
    getVatAmt,
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-0 md:px-8">
      {/* Top Bar Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors hidden sm:flex">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground leading-tight">
                  {initialData ? "Edit" : "New"}{" "}
                  <span className="text-primary">Invoice</span>
                </h1>
                <p className="text-muted-foreground font-medium text-[10px] sm:text-sm uppercase tracking-widest leading-none">
                  {isEdit
                    ? `Serial: ${previewInvoiceData?.invoiceNumber}`
                    : "Generate professional tax invoice"}
                </p>
              </div>
            </div>

            {/* <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex-1 sm:flex-none h-12 px-6 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 transition-all text-slate-700 shadow-sm">
                Preview PDF
              </Button>
              <Button
                type="button"
                onClick={() => formik.handleSubmit()}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 sm:flex-none h-12 px-8 rounded-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 transition-all active:scale-[0.98]">
                <Save className="h-5 w-5" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Invoice"}
              </Button>
            </div> */}
          </div>

          {/* Mobile Back Link */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="sm:hidden -mt-2 p-0 h-auto font-bold text-primary flex items-center gap-2 justify-start hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Button>
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
            initialBooking={initialData?.bookingId as any}
            clientOpen={clientOpen}
            setClientOpen={setClientOpen}
            clientSearchTerm={clientSearchTerm}
            setClientSearchTerm={setClientSearchTerm}
            isLoadingClients={isLoadingClients}
            availableClients={availableClients}
            initialClient={initialData?.clientId}
            handleClientSelect={handleClientSelect}
            handleClearBooking={handleClearBooking}
            handleClearClient={handleClearClient}
          />
          {/* Divider */}
          <div className="border-t border-gray-200 mb-6" />
          {/* Line Items */}
          <InvoiceFormLineItems
            formik={formik}
            isEdit={!!isEdit}
            products={products}
            getFieldError={getFieldError}
            removeLine={removeLine}
            setLineField={setLineField}
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

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Confirm {isEdit ? "Update" : "Save"}
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground pt-2">
              Are you sure you want to{" "}
              {isEdit ? "update this" : "create this new"} invoice? Please
              review the line items and totals before confirming.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="rounded-xl h-11 font-bold border-slate-200 hover:bg-slate-50 flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsConfirmModalOpen(false);
                formik.handleSubmit();
              }}
              className="rounded-xl h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 flex-1 gap-2">
              {isEdit ? (
                <Save className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Confirm & {isEdit ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
