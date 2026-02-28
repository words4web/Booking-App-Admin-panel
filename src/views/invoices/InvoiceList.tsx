"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  useInvoicesQuery,
  useDeleteInvoiceMutation,
} from "@/src/services/invoiceManager/useInvoiceQueries";
import { Invoice } from "@/src/types/invoice.types";
import { InvoiceStatus } from "@/src/enums/invoice.enum";
import { InvoicePDFModal } from "./InvoicePDFModal";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InvoiceList() {
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    id: string;
    number: string;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useInvoicesQuery({
    page,
    limit: 20,
    status:
      statusFilter !== "all" ? (statusFilter as InvoiceStatus) : undefined,
  });

  const deleteMutation = useDeleteInvoiceMutation();

  const invoices = data?.invoices ?? [];
  const pagination = data?.pagination;

  if (isLoading) return <CommonLoader />;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Invoice <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              {pagination
                ? `${pagination.total} invoice${pagination.total !== 1 ? "s" : ""} total`
                : "Manage your invoices"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status filter */}
            <div className="w-[180px]">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}>
                <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                  <SelectItem
                    value="all"
                    className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3 px-4 mb-1">
                    All Statuses
                  </SelectItem>
                  {Object.values(InvoiceStatus).map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3 px-4 mb-1">
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              asChild
              className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 gap-2">
              <Link href="/invoices/new">
                <Plus className="h-5 w-5" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Invoice List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No invoices found.
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/invoices/new">Create your first invoice</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm font-medium">
                  <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Invoice #
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Client
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Date
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Due Date
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Status
                      </th>
                      <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Amount
                      </th>
                      <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {invoices.map((inv) => {
                      const status = inv.status as InvoiceStatus;
                      return (
                        <tr
                          key={inv._id}
                          className="transition-all hover:bg-slate-50 cursor-default">
                          <td className="px-8 py-5 align-middle">
                            <span className="font-bold text-foreground">
                              {inv.invoiceNumber}
                            </span>
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {getClientName(inv.clientId)}
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {formatDate(inv.invoiceDate)}
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                          </td>
                          <td className="px-8 py-5 align-middle">
                            <Badge
                              variant="outline"
                              className={`text-xs font-bold rounded-full px-3 ${STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground border-border"}`}>
                              {STATUS_LABELS[status] ?? status}
                            </Badge>
                          </td>
                          <td className="px-8 py-5 align-middle text-right font-bold text-foreground">
                            £{inv.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-8 py-5 align-middle text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                                title="View PDF"
                                onClick={() => setPdfInvoice(inv)}>
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                                asChild
                                title="View Details">
                                <Link href={`/invoices/${inv._id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                                asChild
                                title="Edit Invoice">
                                <Link href={`/invoices/${inv._id}/edit`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                title="Delete Invoice"
                                onClick={() =>
                                  setDeleteDialog({
                                    id: inv._id,
                                    number: inv.invoiceNumber,
                                  })
                                }>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between px-8 py-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg h-8 text-xs font-bold">
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= pagination.pages}
                      className="rounded-lg h-8 text-xs font-bold">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* PDF Modal */}
      {pdfInvoice && (
        <InvoicePDFModal
          invoice={pdfInvoice}
          open={!!pdfInvoice}
          onClose={() => setPdfInvoice(null)}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${deleteDialog?.number ?? ""}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteDialog) {
            deleteMutation.mutate(deleteDialog.id, {
              onSuccess: () => setDeleteDialog(null),
            });
          }
        }}
        variant="destructive"
        icon={Trash2}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
