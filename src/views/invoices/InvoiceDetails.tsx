"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useInvoiceDetailsQuery } from "@/src/services/invoiceManager/useInvoiceQueries";
import { Invoice } from "@/src/types/invoice.types";
import { InvoiceStatus } from "@/src/enums/invoice.enum";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: "Draft",
  [InvoiceStatus.SENT]: "Sent",
  [InvoiceStatus.PAID]: "Paid",
  [InvoiceStatus.OVERDUE]: "Overdue",
};

const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: "bg-muted text-muted-foreground border-border",
  [InvoiceStatus.SENT]: "bg-blue-50 text-blue-700 border-blue-200",
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

function getCompanyName(cid: Invoice["companyId"]): string {
  if (typeof cid === "string") return cid;
  return cid.name ?? "";
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

export function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: invoice, isLoading, isError } = useInvoiceDetailsQuery(id);

  if (isLoading) return <CommonLoader />;

  if (isError || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground font-medium">
          Invoice not found or failed to load.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/invoices")}
          className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  const status = invoice.status as InvoiceStatus;
  const co = getCompanyDetails(invoice.companyId);

  return (
    <div className="space-y-8 pb-12">
      {/* Action Bar */}
      <div className="flex flex-col gap-6 relative print:hidden">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/invoices")}
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
                <Badge
                  variant="outline"
                  className={`text-xs font-bold rounded-full px-3 ${STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground border-border"}`}>
                  {STATUS_LABELS[status] ?? status}
                </Badge>
                <span className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
                  {formatDate(invoice.invoiceDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="h-12 px-5 rounded-xl font-bold border-border/80 shadow-sm gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="h-12 px-5 rounded-xl font-bold border-border/80 shadow-sm gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 gap-2">
              <Mail className="h-4 w-4" />
              Send to Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white rounded-2xl ring-1 ring-border/50 shadow-sm overflow-hidden p-10 space-y-10">
        {/* Company + Invoice Info */}
        <div className="flex justify-between items-start border-b border-border/50 pb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-foreground">
              {getCompanyName(invoice.companyId)}
            </h2>
            {co?.registrationNumber && (
              <p className="text-sm text-muted-foreground">
                Reg: {co.registrationNumber}
              </p>
            )}
            {co?.vatNumber && (
              <p className="text-sm text-muted-foreground">
                VAT: {co.vatNumber}
              </p>
            )}
          </div>
          <div className="text-right space-y-1">
            <h2 className="text-3xl font-extrabold text-primary uppercase">
              Invoice
            </h2>
            <p className="text-muted-foreground font-medium">
              #{invoice.invoiceNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {formatDate(invoice.invoiceDate)}
            </p>
            {invoice.dueDate && (
              <p className="text-sm text-muted-foreground">
                Due: {formatDate(invoice.dueDate)}
              </p>
            )}
          </div>
        </div>

        {/* Bill To + Payment Details */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Bill To
            </h3>
            <p className="font-bold text-foreground">
              {getClientName(invoice.clientId)}
            </p>
            {getClientAddressLines(invoice.clientId).map((line, i) => (
              <p key={i} className="text-sm text-muted-foreground mt-0.5">
                {line}
              </p>
            ))}
          </div>
          {co && (co.bankName || co.bankAccountNumber) && (
            <div className="text-right">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Payment Details
              </h3>
              {co.bankName && (
                <p className="text-sm text-muted-foreground">
                  Bank: {co.bankName}
                </p>
              )}
              {co.bankCode && (
                <p className="text-sm text-muted-foreground">
                  Sort Code: {co.bankCode}
                </p>
              )}
              {co.bankAccountNumber && (
                <p className="text-sm text-muted-foreground">
                  Account: {co.bankAccountNumber}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
          <table className="w-full text-sm font-medium">
            <thead>
              <tr className="bg-muted/10 border-b border-border/50">
                <th className="h-12 px-6 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  Description
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  Qty
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  Unit Price
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  Ex VAT
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  VAT %
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  VAT
                </th>
                <th className="h-12 px-6 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {invoice.lineItems.map((line, i) => (
                <tr key={i} className="transition-all hover:bg-muted/5">
                  <td className="px-6 py-4 align-middle text-foreground">
                    {line.description}
                  </td>
                  <td className="px-6 py-4 align-middle text-right text-muted-foreground">
                    {line.quantity}
                  </td>
                  <td className="px-6 py-4 align-middle text-right text-muted-foreground">
                    £{line.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 align-middle text-right text-muted-foreground">
                    £{line.exVat.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 align-middle text-right text-muted-foreground">
                    {line.vatPercent}%
                  </td>
                  <td className="px-6 py-4 align-middle text-right text-muted-foreground">
                    £{line.vatAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 align-middle text-right font-bold text-foreground">
                    £{line.lineTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Breakdown + Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-4">
            {invoice.taxBreakdown.length > 0 && (
              <div className="rounded-xl ring-1 ring-border/50 overflow-hidden">
                <div className="bg-muted/20 px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50">
                  Tax Breakdown
                </div>
                <table className="w-full text-xs font-medium">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="px-5 py-2.5 text-left text-muted-foreground/70 font-bold uppercase tracking-widest">
                        Rate
                      </th>
                      <th className="px-5 py-2.5 text-right text-muted-foreground/70 font-bold uppercase tracking-widest">
                        Net
                      </th>
                      <th className="px-5 py-2.5 text-right text-muted-foreground/70 font-bold uppercase tracking-widest">
                        VAT
                      </th>
                      <th className="px-5 py-2.5 text-right text-muted-foreground/70 font-bold uppercase tracking-widest">
                        Incl. VAT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {invoice.taxBreakdown.map((row, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3 text-muted-foreground">
                          {row.vatRateLabel}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          £{row.net.toFixed(2)}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          £{row.vat.toFixed(2)}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          £{row.inclVat.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals */}
            <div className="rounded-xl ring-1 ring-border/50 divide-y divide-border/30 overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5 text-sm">
                <span className="text-muted-foreground font-medium">
                  Subtotal (Ex VAT)
                </span>
                <span className="font-bold text-foreground">
                  £{invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 text-sm">
                <span className="text-muted-foreground font-medium">
                  Total VAT
                </span>
                <span className="font-bold text-foreground">
                  £{invoice.totalVat.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-4 bg-muted/10">
                <span className="font-black text-foreground text-base">
                  Total (Incl. VAT)
                </span>
                <span className="font-black text-primary text-lg">
                  £{invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-border/50 pt-8">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Notes / Payment Terms
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>
            Thank you for your business. Please pay within the agreed terms.
          </p>
          {invoice.paymentLink && (
            <p className="mt-1">
              Pay online:{" "}
              <a
                href={invoice.paymentLink}
                className="text-primary underline"
                target="_blank"
                rel="noreferrer">
                {invoice.paymentLink}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Back to list */}
      <div className="flex justify-start print:hidden">
        <Button
          asChild
          variant="outline"
          className="h-10 px-5 rounded-xl font-bold border-border/80 gap-2">
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
        </Button>
      </div>
    </div>
  );
}
