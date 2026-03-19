"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import {
  useInvoiceDetailsQuery,
  useUpdateInvoiceMutation,
} from "@/src/services/invoiceManager/useInvoiceQueries";
import { Invoice, InvoiceLineFormData } from "@/src/types/invoice.types";
import { InvoiceStatus, PaymentStatus } from "@/src/enums/invoice.enum";
import { InvoicePDFModal } from "./InvoicePDFModal";

const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: "bg-muted text-muted-foreground border-border",
  [InvoiceStatus.SENT]: "bg-primary/10 text-primary border-primary/20",
  [InvoiceStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [InvoiceStatus.OVERDUE]: "bg-red-50 text-red-700 border-red-200",
};

function getClientName(clientId: Invoice["clientId"]): string {
  if (typeof clientId === "string") return clientId;
  return (
    clientId.legalDetails?.legalName ??
    `${clientId.contactInfo?.firstName ?? ""} ${clientId.contactInfo?.lastName ?? ""}`.trim()
  );
}

function getClientAddressLines(clientId: Invoice["clientId"]): string[] {
  if (typeof clientId === "string") return [];
  const a = clientId.address;
  if (!a) return [];
  return [a.addressLine1, a.city, a.postcode, a.country].filter(
    Boolean,
  ) as string[];
}

function getCompanyDetails(cid: Invoice["companyId"]) {
  if (typeof cid === "string") return null;
  return cid;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const EMPTY_LINE: InvoiceLineFormData = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  vatPercent: 20,
};

export function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: invoice, isLoading, isError } = useInvoiceDetailsQuery(id);
  const updateMutation = useUpdateInvoiceMutation(id);

  const [pdfOpen, setPdfOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable state
  const [editStatus, setEditStatus] = useState<InvoiceStatus>(
    InvoiceStatus.DRAFT,
  );
  const [editDueDate, setEditDueDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPaymentLink, setEditPaymentLink] = useState("");
  const [editLines, setEditLines] = useState<InvoiceLineFormData[]>([]);

  useEffect(() => {
    if (invoice) {
      setEditStatus(invoice.status as InvoiceStatus);
      setEditDueDate(
        invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
      );
      setEditNotes(invoice.notes ?? "");
      setEditPaymentLink(invoice.paymentLink ?? "");
      setEditLines(
        invoice.lineItems.map((l) => ({
          productId: l.productId,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          vatPercent: l.vatPercent,
        })),
      );
    }
  }, [invoice]);

  const handleSave = () => {
    updateMutation.mutate(
      {
        status: editStatus as any,
        dueDate: editDueDate || undefined,
        notes: editNotes || undefined,
        paymentLink: editPaymentLink || undefined,
        lineItems: editLines,
      } as any,
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleCancel = () => {
    if (invoice) {
      setEditStatus(invoice.status as InvoiceStatus);
      setEditDueDate(
        invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
      );
      setEditNotes(invoice.notes ?? "");
      setEditPaymentLink(invoice.paymentLink ?? "");
      setEditLines(
        invoice.lineItems.map((l) => ({
          productId: l.productId,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          vatPercent: l.vatPercent,
        })),
      );
    }
    setIsEditing(false);
  };

  const setLineField = (
    index: number,
    field: keyof InvoiceLineFormData,
    value: string | number,
  ) => {
    setEditLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    );
  };

  const addLine = () => setEditLines((prev) => [...prev, { ...EMPTY_LINE }]);
  const removeLine = (i: number) =>
    setEditLines((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev,
    );

  // Compute live totals when editing
  const computedSubtotal = editLines.reduce(
    (s, l) => s + l.quantity * l.unitPrice,
    0,
  );
  const computedVat = editLines.reduce(
    (s, l) => s + l.quantity * l.unitPrice * (l.vatPercent / 100),
    0,
  );
  const computedTotal = computedSubtotal + computedVat;

  if (isLoading) return <CommonLoader />;

  if (isError || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground font-medium">
          Invoice not found or failed to load.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES_PATH.INVOICES.BASE)}
          className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  const co = getCompanyDetails(invoice.companyId);
  const companyName =
    typeof invoice.companyId === "string"
      ? invoice.companyId
      : invoice.companyId.name;
  const isPaid = invoice.paymentStatus === PaymentStatus.PAID;
  const displaySubtotal = isEditing ? computedSubtotal : invoice.subtotal;
  const displayVat = isEditing ? computedVat : invoice.totalVat;
  const displayTotal = isEditing ? computedTotal : invoice.totalAmount;

  return (
    <div className="space-y-6 pb-12 overflow-x-hidden">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES_PATH.INVOICES.BASE)}
            className="rounded-xl h-9 gap-2 font-bold text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Invoice{" "}
              <span className="text-primary">#{invoice.invoiceNumber}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-muted-foreground font-medium text-sm">
                {formatDate(invoice.invoiceDate)}
              </span>
              {isPaid && (
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-11 px-6 rounded-xl font-bold border-slate-200 gap-2 hover:bg-slate-50"
                disabled={updateMutation.isPending}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="h-11 px-8 rounded-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-200 gap-2 transition-all active:scale-95">
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setPdfOpen(true)}
                className="h-11 px-5 rounded-xl font-bold border-border/80 gap-2">
                <Download className="h-4 w-4" />
                PDF Preview
              </Button>
              <Button
                onClick={() => router.push(ROUTES_PATH.INVOICES.EDIT(id))}
                className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
                <Pencil className="h-4 w-4" />
                Edit Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Document Wrapper */}
      <div className="bg-white rounded-3xl ring-1 ring-border shadow-2xl overflow-hidden relative">
        {/* Document Header - Clean White */}
        <div className="p-8 sm:p-12 space-y-12">
          {/* Top Info: Bill To & Logo */}
          <div className="flex justify-between items-start gap-10">
            <div className="max-w-[300px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Bill To
              </p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">
                {getClientName(invoice.clientId)}
              </h3>
              {getClientAddressLines(invoice.clientId).map((line, i) => (
                <p key={i} className="text-sm font-medium text-slate-500 mt-1">
                  {line}
                </p>
              ))}
            </div>

            <div className="text-right flex flex-col items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/divineLogo.png"
                alt="Logo"
                className="h-16 w-auto mb-6"
              />
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900 leading-tight">
                  {typeof invoice.companyId === "string"
                    ? invoice.companyId
                    : invoice.companyId.name}
                </p>
                {co?.address?.addressLine1 && (
                  <p className="text-sm font-medium text-slate-500">
                    {co.address.addressLine1}
                  </p>
                )}
                {co?.address?.city && (
                  <p className="text-sm font-medium text-slate-500">
                    {co.address.city}, {co.address.postcode}
                  </p>
                )}
                {co?.telephone && (
                  <p className="text-sm font-medium text-slate-500">
                    Tel: {co.telephone}
                  </p>
                )}
                {co?.adminEmail && (
                  <p className="text-sm font-medium text-slate-500">
                    Email: {co.adminEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice ID & Dates Meta */}
          <div className="border-y border-slate-100 py-8 flex flex-wrap justify-between gap-8 items-center">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                Status
              </p>
              {isEditing ? (
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as InvoiceStatus)}>
                  <SelectTrigger className="h-10 w-40 rounded-xl bg-slate-50 border-none font-bold text-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none shadow-2xl rounded-2xl">
                    {Object.values(InvoiceStatus).map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="font-bold py-3 px-4 rounded-xl cursor-pointer">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${STATUS_CLASSES[invoice.status as InvoiceStatus]?.includes("emerald") ? "bg-emerald-500" : "bg-primary"}`}
                  />
                  <p className="text-sm font-black text-slate-900">
                    {invoice.status}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center flex-1 text-center">
              <h1 className="text-2xl font-black text-slate-900">
                {invoice.transactionType}
              </h1>
              <p className="text-sm font-bold text-slate-400">
                #{invoice.invoiceNumber}
              </p>
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  Date
                </p>
                <p className="text-sm font-black text-slate-900">
                  {formatDate(invoice.invoiceDate)}
                </p>
              </div>
              <div className="flex flex-col text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  Due Date
                </p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="h-10 w-40 rounded-xl bg-slate-50 border-none font-bold text-slate-900 text-right"
                  />
                ) : (
                  <p className="text-sm font-black text-slate-900">
                    {invoice.dueDate ? formatDate(invoice.dueDate) : "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-900">Line Items</h4>
              {isEditing && (
                <Button
                  onClick={addLine}
                  variant="outline"
                  className="h-10 rounded-xl border-dashed border-2 border-primary/30 text-primary font-black gap-2 hover:bg-primary/5 px-6 transition-all">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Description
                    </th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Account
                    </th>
                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-24">
                      Qty
                    </th>
                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-32">
                      Rate
                    </th>
                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-24">
                      VAT%
                    </th>
                    <th className="text-right py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-32">
                      Amount
                    </th>
                    {isEditing && <th className="w-10" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isEditing
                    ? editLines.map((line, i) => (
                        <tr key={i} className="group">
                          <td className="py-4 align-top min-w-[200px]">
                            <Input
                              value={line.description}
                              onChange={(e) =>
                                setLineField(i, "description", e.target.value)
                              }
                              className="h-10 border-none font-bold text-slate-900 focus:bg-slate-50 transition-colors bg-transparent p-0 placeholder:text-slate-300"
                              placeholder="Description..."
                            />
                          </td>
                          <td className="py-4 px-4 align-top w-40">
                            {/* Account column removed */}
                          </td>
                          <td className="py-4 px-4 align-top">
                            <Input
                              type="number"
                              value={line.quantity}
                              onChange={(e) =>
                                setLineField(
                                  i,
                                  "quantity",
                                  Number(e.target.value),
                                )
                              }
                              className="h-10 border-none font-bold text-slate-900 focus:bg-slate-50 transition-colors bg-transparent p-0 text-right"
                            />
                          </td>
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center justify-end">
                              <span className="text-slate-400 mr-1 font-bold">
                                £
                              </span>
                              <Input
                                type="number"
                                value={line.unitPrice}
                                onChange={(e) =>
                                  setLineField(
                                    i,
                                    "unitPrice",
                                    Number(e.target.value),
                                  )
                                }
                                className="h-10 border-none font-bold text-slate-900 focus:bg-slate-50 transition-colors bg-transparent p-0 text-right w-24"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <Input
                              type="number"
                              value={line.vatPercent}
                              onChange={(e) =>
                                setLineField(
                                  i,
                                  "vatPercent",
                                  Number(e.target.value),
                                )
                              }
                              className="h-10 border-none font-bold text-slate-900 focus:bg-slate-50 transition-colors bg-transparent p-0 text-right"
                            />
                          </td>
                          <td className="py-4 text-right align-top">
                            <p className="h-10 flex items-center justify-end font-black text-slate-900">
                              £
                              {Number(
                                (line.quantity || 0) * (line.unitPrice || 0) ||
                                  0,
                              ).toFixed(2)}
                            </p>
                          </td>
                          <td className="py-4 pl-4 align-top">
                            <Button
                              onClick={() => removeLine(i)}
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-slate-300 hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    : invoice.lineItems.map((line, i) => (
                        <tr key={i}>
                          <td className="py-5 font-bold text-slate-900">
                            {line.description}
                          </td>
                          <td className="py-5 px-4 font-bold text-slate-500 text-sm"></td>
                          <td className="py-5 px-4 text-right font-black text-slate-900">
                            {line.quantity}
                          </td>
                          <td className="py-5 px-4 text-right font-black text-slate-900">
                            £{Number(line.unitPrice || 0).toFixed(2)}
                          </td>
                          <td className="py-5 px-4 text-right font-black text-slate-900">
                            {line.vatPercent}%
                          </td>
                          <td className="py-5 text-right font-black text-slate-900 text-lg">
                            £{Number(line.exVat || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand Total Section */}
          <div className="flex justify-between items-start gap-10">
            <div className="flex-1 max-w-[400px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Payment Terms & Notes
              </p>
              {isEditing ? (
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="min-h-[120px] rounded-2xl bg-slate-50 border-none font-bold text-slate-900 resize-none p-4"
                  placeholder="Enter payment terms or notes..."
                />
              ) : (
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic whitespace-pre-line">
                  {invoice.notes ||
                    "Late payment will be subject to a compensation payment plus interest charged at 8% above the Bank Of England base rate."}
                </p>
              )}

              {isEditing && (
                <div className="mt-6">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                    Payment Link
                  </p>
                  <Input
                    value={editPaymentLink}
                    onChange={(e) => setEditPaymentLink(e.target.value)}
                    className="h-10 rounded-xl bg-slate-50 border-none font-bold text-slate-900"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div className="w-[340px] space-y-4">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 space-y-4">
                {/* Product Total (computed roughly as subtotal - waiting - night - extra) */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Product Total</span>
                  <span className="font-black text-slate-900">
                    £{Number(
                        (invoice.subtotal || 0) -
                        (invoice.waitingTotal || 0) -
                        (invoice.isNightShift ? invoice.nightShiftAmount || 0 : 0) -
                        (invoice.extraCharges || []).reduce((sum, c) => sum + (c.amount || 0), 0)
                      ).toFixed(2)}
                  </span>
                </div>
                {(invoice.waitingTotal ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Waiting Time ({invoice.waitingMinutes} mins)</span>
                    <span className="font-black text-slate-900">
                      £{Number(invoice.waitingTotal || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.isNightShift && (invoice.nightShiftAmount ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Night Shift</span>
                    <span className="font-black text-slate-900">
                      £{Number(invoice.nightShiftAmount || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {(invoice.extraCharges || []).map((charge, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">{charge.label}</span>
                    <span className="font-black text-slate-900">
                      £{Number(charge.amount || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-black text-slate-900">Subtotal</span>
                  <span className="font-black text-slate-900">
                    £{Number(displaySubtotal || 0).toFixed(2)}
                  </span>
                </div>
                {/* Simplified VAT display for details view */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Total VAT</span>
                  <span className="font-black text-slate-900">
                    £{Number(displayVat || 0).toFixed(2)}
                  </span>
                </div>
                <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-primary">
                    £{Number(displayTotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Bank info */}
          <div className="border-t border-slate-100 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
                  Bank Transfer Details
                </p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-bold text-slate-400 w-32 inline-block">
                      Account Name:
                    </span>{" "}
                    <span className="font-black text-slate-900">
                      {co?.bankName || companyName}
                    </span>
                  </p>
                  {co?.bankCode && (
                    <p className="text-sm">
                      <span className="font-bold text-slate-400 w-32 inline-block">
                        Sort Code:
                      </span>{" "}
                      <span className="font-black text-slate-900">
                        {co.bankCode}
                      </span>
                    </p>
                  )}
                  {co?.bankAccountNumber && (
                    <p className="text-sm">
                      <span className="font-bold text-slate-400 w-32 inline-block">
                        Account Number:
                      </span>{" "}
                      <span className="font-black text-slate-900">
                        {co.bankAccountNumber}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col justify-end">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  Registration
                </p>
                <p className="text-xs font-bold text-slate-400">
                  {companyName}{" "}
                  {co?.registrationNumber &&
                    `— Registered No: ${co.registrationNumber}`}
                </p>
                {co?.vatNumber && co.vatNumber !== "N/A" && (
                  <p className="text-xs font-bold text-slate-400">
                    VAT Reg No: {co.vatNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating PAID stamp */}
        {isPaid && !isEditing && (
          <div className="absolute top-40 left-1/2 -translate-x-1/2 pointer-events-none rotate-[-12deg] opacity-10">
            <div className="border-[12px] border-emerald-500 rounded-[32px] px-16 py-8">
              <span className="text-9xl font-black text-emerald-500 tracking-[0.2em]">
                PAID
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {pdfOpen && (
        <InvoicePDFModal
          invoice={invoice}
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
        />
      )}

      {/* Bottom Back Button */}
      <div className="flex justify-start print:hidden">
        <Button
          asChild
          variant="ghost"
          className="h-10 px-5 rounded-xl font-bold text-muted-foreground gap-2 hover:bg-slate-100">
          <Link href={ROUTES_PATH.INVOICES.BASE}>
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
        </Button>
      </div>
    </div>
  );
}
