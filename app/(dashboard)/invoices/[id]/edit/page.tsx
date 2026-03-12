"use client";

import { useParams } from "next/navigation";
import { InvoiceForm } from "@/src/views/invoices/InvoiceForm";
import { useInvoiceDetailsQuery } from "@/src/services/invoiceManager/useInvoiceQueries";
import { CommonLoader } from "@/src/components/common/CommonLoader";

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading, isError } = useInvoiceDetailsQuery(id);

  if (isLoading) return <CommonLoader />;
  if (isError || !invoice)
    return (
      <div className="p-8 text-center font-bold text-red-500">
        Invoice not found
      </div>
    );

  const initialData = {
    bookingId:
      typeof invoice.bookingId === "string"
        ? invoice.bookingId
        : invoice.bookingId?._id,
    clientId:
      typeof invoice.clientId === "string"
        ? invoice.clientId
        : invoice.clientId?._id,
    companyId:
      typeof invoice.companyId === "string"
        ? invoice.companyId
        : invoice.companyId?._id,
    invoiceDate: new Date(invoice.invoiceDate),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    lineItems: invoice.lineItems.map((l) => ({
      productId: typeof l.productId === "string" ? l.productId : undefined,
      description: l.description,
      account: l.account || "Income",
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      vatPercent: l.vatPercent,
    })),
    billingName: invoice.billingName,
    billingAddress: invoice.billingAddress,
    companyAddress: invoice.companyAddress,
    waitingMinutes: invoice.waitingMinutes,
    waitingTotal: invoice.waitingTotal,
    isNightShift: invoice.isNightShift,
    nightShiftAmount: invoice.nightShiftAmount,
    logoFile: invoice.logoFile,
    notes: invoice.notes,
    terms: invoice.terms,
    paymentLink: invoice.paymentLink,
  };

  return (
    <InvoiceForm
      initialData={initialData as any}
      isEdit={true}
      invoiceId={id}
    />
  );
}
