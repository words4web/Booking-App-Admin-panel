"use client";

import { useRef } from "react";
import { Printer, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/src/types/invoice.types";

interface InvoicePDFModalProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}

function getClientName(cid: Invoice["clientId"]): string {
  if (typeof cid === "string") return cid;
  return (
    cid.legalDetails?.legalName ??
    `${cid.contactInfo?.firstName ?? ""} ${cid.contactInfo?.lastName ?? ""}`.trim()
  );
}

function getClientAddressLines(cid: Invoice["clientId"]): string[] {
  if (typeof cid === "string") return [];
  const a = cid.address;
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

export function InvoicePDFModal({
  invoice,
  open,
  onClose,
}: InvoicePDFModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    const html = contentRef.current.innerHTML;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 8px 12px; text-align: left; font-size: 12px; }
        th { font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        td { border-bottom: 1px solid #f1f5f9; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        h1, h2, h3 { margin: 0; }
        .header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 24px; }
        .totals { float: right; width: 280px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .totals-row.final { font-weight: bold; font-size: 15px; background: #f8fafc; }
      </style>
      </head><body>${html}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const co = getCompanyDetails(invoice.companyId);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/50 sticky top-0 bg-white z-10">
          <DialogTitle className="text-base font-bold text-foreground">
            Invoice Preview — {invoice.invoiceNumber}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-9 rounded-xl font-bold border-border/80 gap-1.5 text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Content */}
        <div ref={contentRef} className="p-8 bg-white space-y-8 text-sm">
          {/* Header */}
          <div className="header flex justify-between items-start border-b border-border/50 pb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-foreground">
                {getCompanyName(invoice.companyId)}
              </h2>
              {co?.registrationNumber && (
                <p className="text-muted-foreground text-sm">
                  Reg: {co.registrationNumber}
                </p>
              )}
              {co?.vatNumber && (
                <p className="text-muted-foreground text-sm">
                  VAT: {co.vatNumber}
                </p>
              )}
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-extrabold text-primary uppercase">
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

          {/* Bill To + Payment */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Bill To
              </p>
              <p className="font-bold text-foreground">
                {getClientName(invoice.clientId)}
              </p>
              {getClientAddressLines(invoice.clientId).map((l, i) => (
                <p key={i} className="text-sm text-muted-foreground mt-0.5">
                  {l}
                </p>
              ))}
            </div>
            {co && (co.bankName || co.bankAccountNumber) && (
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Payment Details
                </p>
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
          <table className="w-full">
            <thead>
              <tr className="border-y border-border/50 bg-muted/10">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Description
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Qty
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Unit Price
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Ex VAT
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  VAT %
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  VAT Amt
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {invoice.lineItems.map((line, i) => (
                <tr key={i}>
                  <td className="px-3 py-3 text-foreground">
                    {line.description}
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    {line.quantity}
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    £{line.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    £{line.exVat.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    {line.vatPercent}%
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    £{line.vatAmount.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-foreground">
                    £{line.lineTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax Breakdown + Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-3">
              {invoice.taxBreakdown.length > 0 && (
                <div className="ring-1 ring-border/50 rounded-xl overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/30">
                    Tax Breakdown
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="px-4 py-2 text-left font-bold text-muted-foreground/70 uppercase">
                          Rate
                        </th>
                        <th className="px-4 py-2 text-right font-bold text-muted-foreground/70 uppercase">
                          Net
                        </th>
                        <th className="px-4 py-2 text-right font-bold text-muted-foreground/70 uppercase">
                          VAT
                        </th>
                        <th className="px-4 py-2 text-right font-bold text-muted-foreground/70 uppercase">
                          Incl. VAT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {invoice.taxBreakdown.map((row, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {row.vatRateLabel}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground">
                            £{row.net.toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground">
                            £{row.vat.toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground">
                            £{row.inclVat.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="ring-1 ring-border/50 rounded-xl divide-y divide-border/30 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Subtotal (Ex VAT)
                  </span>
                  <span className="font-bold text-foreground">
                    £{invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-muted-foreground font-medium">
                    Total VAT
                  </span>
                  <span className="font-bold text-foreground">
                    £{invoice.totalVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3.5 bg-muted/10">
                  <span className="font-black text-foreground">
                    Total (Incl. VAT)
                  </span>
                  <span className="font-black text-primary text-base">
                    £{invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes + Footer */}
          {invoice.notes && (
            <div className="border-t border-border/50 pt-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                Notes
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}
          <div className="border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            <p>
              Thank you for your business. Please pay within the agreed terms.
            </p>
            {invoice.paymentLink && (
              <p className="mt-1">Pay online: {invoice.paymentLink}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
