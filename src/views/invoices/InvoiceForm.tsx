"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ArrowLeft, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { InvoiceSchema } from "@/src/schemas/validationSchemas";
import {
  InvoiceFormData,
  InvoiceLineFormData,
} from "@/src/types/invoice.types";
import { TransactionType } from "@/src/enums/invoice.enum";
import { BookingStatus } from "@/src/enums/booking.enum";
import { useBookingsQuery } from "@/src/services/bookingManager/useBookingQueries";
import { useCreateInvoiceMutation } from "@/src/services/invoiceManager/useInvoiceQueries";
import { Booking } from "@/src/types/booking.types";

function getBookingLabel(b: Booking): string {
  const c = b.clientId;
  const clientName =
    typeof c === "string"
      ? c
      : (c.legalDetails?.legalName ??
        `${c.legalDetails?.legalName ?? ""}`.trim());
  const dt = new Date(b.scheduledDateTime).toLocaleDateString("en-GB");
  return `${b.bookingId} — ${clientName} (${dt})`;
}

const EMPTY_LINE: InvoiceLineFormData = {
  productId: "",
  description: "",
  account: "Income",
  quantity: 1,
  unitPrice: 0,
  vatPercent: 20,
};

interface LineComputedTotals {
  subtotal: number;
  totalVat: number;
  totalAmount: number;
}

function computeTotals(lines: InvoiceLineFormData[]): LineComputedTotals {
  let subtotal = 0;
  let totalVat = 0;
  lines.forEach((l) => {
    const exVat = l.quantity * l.unitPrice;
    subtotal += exVat;
    totalVat += exVat * (l.vatPercent / 100);
  });
  return { subtotal, totalVat, totalAmount: subtotal + totalVat };
}

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
}

export function InvoiceForm({ initialData }: InvoiceFormProps) {
  const router = useRouter();
  const createMutation = useCreateInvoiceMutation();

  const { data: bookingsData, isLoading: isLoadingBookings } = useBookingsQuery(
    {
      status: BookingStatus.COMPLETED,
      limit: 100,
    },
  );
  const completedBookings = bookingsData?.bookings ?? [];

  const [totals, setTotals] = useState<LineComputedTotals>({
    subtotal: 0,
    totalVat: 0,
    totalAmount: 0,
  });

  const formik = useFormik<InvoiceFormData>({
    initialValues: {
      clientId: initialData?.clientId ?? "",
      bookingId: initialData?.bookingId ?? "",
      dueDate: initialData?.dueDate ?? "",
      transactionType: initialData?.transactionType ?? TransactionType.SALES,
      lineItems: initialData?.lineItems ?? [{ ...EMPTY_LINE }],
      notes: initialData?.notes ?? "",
      paymentLink: initialData?.paymentLink ?? "",
    },
    validationSchema: toFormikValidationSchema(InvoiceSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      createMutation.mutate(values, {
        onSuccess: () => router.push("/invoices"),
      });
    },
  });

  const recomputeTotals = useCallback(() => {
    setTotals(computeTotals(formik.values.lineItems));
  }, [formik.values.lineItems]);

  useEffect(() => {
    recomputeTotals();
  }, [recomputeTotals]);

  const handleBookingSelect = (bookingId: string) => {
    const booking = completedBookings.find((b) => b._id === bookingId);
    if (!booking) return;
    formik.setFieldValue("bookingId", bookingId);
    const clientId =
      typeof booking.clientId === "string"
        ? booking.clientId
        : booking.clientId._id;
    formik.setFieldValue("clientId", clientId);
    if (booking.products.length > 0) {
      const lines: InvoiceLineFormData[] = booking.products.map((p) => ({
        productId:
          typeof p.productId === "string"
            ? p.productId
            : (p.productId as { _id: string })?._id,
        description: p.name,
        account: "Income",
        quantity: p.quantity,
        unitPrice: p.rate,
        vatPercent: 20,
      }));
      formik.setFieldValue("lineItems", lines);
    }
  };

  const addLineItem = () =>
    formik.setFieldValue("lineItems", [
      ...formik.values.lineItems,
      { ...EMPTY_LINE },
    ]);

  const removeLineItem = (index: number) => {
    const updated = formik.values.lineItems.filter((_, i) => i !== index);
    formik.setFieldValue(
      "lineItems",
      updated.length > 0 ? updated : [{ ...EMPTY_LINE }],
    );
  };

  const setLineField = (
    index: number,
    field: keyof InvoiceLineFormData,
    value: string | number,
  ) => formik.setFieldValue(`lineItems.${index}.${field}`, value);

  const getExVat = (l: InvoiceLineFormData) => l.quantity * l.unitPrice;
  const getVatAmt = (l: InvoiceLineFormData) =>
    getExVat(l) * (l.vatPercent / 100);
  const getLineTotal = (l: InvoiceLineFormData) => getExVat(l) + getVatAmt(l);

  if (isLoadingBookings) return <CommonLoader />;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="rounded-xl h-9 gap-2 font-bold text-muted-foreground">
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">
                Create <span className="text-primary">Invoice</span>
              </h1>
              <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
                Select a completed booking and review line items
              </p>
            </div>
          </div>
          <Button
            type="submit"
            form="invoice-form"
            disabled={createMutation.isPending}
            className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
            {createMutation.isPending ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </div>

      <form
        id="invoice-form"
        onSubmit={formik.handleSubmit}
        className="space-y-6">
        {/* Invoice Details Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-5">
            <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Select */}
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Booking (Completed){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={handleBookingSelect}
                  value={formik.values.bookingId}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <SelectValue placeholder="Select a completed booking..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                    {completedBookings.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground font-medium">
                        No completed bookings
                      </div>
                    ) : (
                      completedBookings.map((b) => (
                        <SelectItem
                          key={b._id}
                          value={b._id}
                          className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3 px-4 mb-1">
                          {getBookingLabel(b)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.bookingId && formik.errors.bookingId && (
                  <p className="text-xs text-destructive font-medium">
                    {formik.errors.bookingId as string}
                  </p>
                )}
              </div>

              {/* Transaction Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Transaction Type
                </Label>
                <Select
                  onValueChange={(v) =>
                    formik.setFieldValue("transactionType", v)
                  }
                  value={formik.values.transactionType}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                    {Object.values(TransactionType).map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3 px-4 mb-1">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Due Date (Optional)
                </Label>
                <Input
                  type="date"
                  {...formik.getFieldProps("dueDate")}
                  className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Payment Link */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Payment Link (Optional)
                </Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  {...formik.getFieldProps("paymentLink")}
                  className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Notes / Payment Terms (Optional)
                </Label>
                <Textarea
                  placeholder="e.g. Please pay within 30 days..."
                  {...formik.getFieldProps("notes")}
                  className="min-h-[80px] rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">
                Line Items
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                className="h-9 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-1.5">
                <Plus className="h-4 w-4" />
                Add Line
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm font-medium">
                <thead>
                  <tr className="bg-muted/10 border-b border-border/50">
                    <th className="h-12 px-6 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 w-[30%]">
                      Description
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Qty
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Unit Price (£)
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      VAT %
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Ex VAT
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      VAT Amt
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Total
                    </th>
                    <th className="h-12 px-4 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {formik.values.lineItems.map((line, i) => (
                    <tr key={i} className="transition-all hover:bg-muted/5">
                      <td className="px-6 py-4 align-middle">
                        <Input
                          placeholder="Description..."
                          value={line.description}
                          onChange={(e) =>
                            setLineField(i, "description", e.target.value)
                          }
                          className="h-9 rounded-lg border-border/80 text-xs"
                        />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={line.quantity}
                          onChange={(e) =>
                            setLineField(
                              i,
                              "quantity",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-9 rounded-lg border-border/80 text-xs text-right w-20"
                        />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={line.unitPrice}
                          onChange={(e) =>
                            setLineField(
                              i,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-9 rounded-lg border-border/80 text-xs text-right w-24"
                        />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={line.vatPercent}
                          onChange={(e) =>
                            setLineField(
                              i,
                              "vatPercent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-9 rounded-lg border-border/80 text-xs text-right w-20"
                        />
                      </td>
                      {/* Computed read-only */}
                      <td className="px-4 py-4 align-middle text-right text-muted-foreground text-xs">
                        £{getExVat(line).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 align-middle text-right text-muted-foreground text-xs">
                        £{getVatAmt(line).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 align-middle text-right font-bold text-foreground text-xs">
                        £{getLineTotal(line).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 align-middle text-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLineItem(i)}
                          disabled={formik.values.lineItems.length === 1}
                          className="h-8 w-8 rounded-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end px-8 py-6 border-t border-border/50">
              <div className="w-72 rounded-xl ring-1 ring-border/50 divide-y divide-border/30 overflow-hidden">
                <div className="flex justify-between items-center px-5 py-3.5 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Subtotal (Ex VAT)
                  </span>
                  <span className="font-bold text-foreground">
                    £{totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-5 py-3.5 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Total VAT
                  </span>
                  <span className="font-bold text-foreground">
                    £{totals.totalVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 bg-muted/10">
                  <span className="font-black text-foreground text-base">
                    Total (Incl. VAT)
                  </span>
                  <span className="font-black text-primary text-lg">
                    £{totals.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
