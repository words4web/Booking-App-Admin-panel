"use client";

import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useState } from "react";
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Mail,
  Link2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  useInvoicesQuery,
  useDeleteInvoiceMutation,
  useToggleInvoicePaymentMutation,
} from "@/src/services/invoiceManager/useInvoiceQueries";
import { Invoice } from "@/src/types/invoice.types";
import { InvoicePDFModal } from "./InvoicePDFModal";
import EmailInvoiceModal from "./EmailInvoiceModal";
import SendPaymentLinkModal from "./SendPaymentLinkModal";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const [page, setPage] = useState(1);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [toggleStatusDialog, setToggleStatusDialog] = useState<Invoice | null>(
    null,
  );
  const [emailModal, setEmailModal] = useState<Invoice | null>(null);
  const [sendPaymentLinkModal, setSendPaymentLinkModal] =
    useState<Invoice | null>(null);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data, isLoading } = useInvoicesQuery({
    page,
    limit: PAGINATION_LIMIT,
    companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
  });

  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const deleteMutation = useDeleteInvoiceMutation();
  const toggleStatusMutation = useToggleInvoicePaymentMutation();

  const invoices = data?.invoices ?? [];
  const pagination = data?.pagination;

  if (isLoading) return <CommonLoader />;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
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
            {isSuperAdmin && (
              <div className="w-[200px]">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(val) => {
                    setSelectedCompanyId(val);
                    setPage(1);
                  }}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="Filter by Company" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100] min-w-[220px]">
                    <SelectItem
                      value="all"
                      className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3.5 px-4 mb-1 transition-colors">
                      All Companies
                    </SelectItem>
                    {companies?.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company._id}
                        className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-3.5 px-4 mb-1 transition-colors">
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              asChild
              className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 gap-2">
              <Link href={ROUTES_PATH.INVOICES.NEW}>
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
              <div className="mt-8">
                <Link href={ROUTES_PATH.INVOICES.NEW}>
                  Create your first invoice
                </Link>
              </div>
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
                      {isSuperAdmin && (
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          Company
                        </th>
                      )}
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
                          {isSuperAdmin && (
                            <td className="px-8 py-5 align-middle text-muted-foreground">
                              {typeof inv?.companyId === "object"
                                ? (inv.companyId as { name: string }).name
                                : "—"}
                            </td>
                          )}
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {formatDate(inv.invoiceDate)}
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                          </td>
                          <td className="px-8 py-5 align-middle">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap tracking-wider border ${
                                inv.isPaid
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}>
                              {inv.isPaid ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Paid
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  Pending Payment
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-8 py-5 align-middle text-right font-bold text-foreground">
                            £{Number(inv.totalAmount || 0).toFixed(2)}
                          </td>
                          <td className="px-8 py-5 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-slate-100">
                                  <MoreVertical className="h-4 w-4 text-slate-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border-border bg-white p-1.5 shadow-xl">
                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  onClick={() => setPdfInvoice(inv)}>
                                  <FileText className="h-4 w-4 text-slate-500" />
                                  View PDF
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 ${
                                    inv.isPaid
                                      ? "text-emerald-600 focus:text-emerald-700"
                                      : "text-amber-600 focus:text-amber-700"
                                  }`}
                                  onClick={() => setToggleStatusDialog(inv)}>
                                  {inv.isPaid ? (
                                    <>
                                      <CheckCircle className="h-4 w-4" />
                                      Mark as Pending
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="h-4 w-4" />
                                      Mark as Paid
                                    </>
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  onClick={() => setEmailModal(inv)}>
                                  <Mail className="h-4 w-4 text-primary" />
                                  Send via Email
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  onClick={() => setSendPaymentLinkModal(inv)}>
                                  <Link2 className="h-4 w-4 text-primary" />
                                  Send Payment Link
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-border/50" />

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  asChild>
                                  <Link href={`/invoices/${inv._id}/edit`}>
                                    <Pencil className="h-4 w-4 text-slate-500" />
                                    Edit Invoice
                                  </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                  onClick={() =>
                                    setDeleteDialog({
                                      id: inv._id,
                                      number: inv.invoiceNumber,
                                    })
                                  }>
                                  <Trash2 className="h-4 w-4" />
                                  Delete Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          invoiceId={pdfInvoice._id}
          open={!!pdfInvoice}
          onClose={() => setPdfInvoice(null)}
        />
      )}

      {/* Email Modal */}
      {emailModal && (
        <EmailInvoiceModal
          isOpen={!!emailModal}
          onClose={() => setEmailModal(null)}
          invoiceId={emailModal._id}
          invoiceNumber={emailModal.invoiceNumber}
          defaultEmail={
            typeof emailModal.clientId === "object"
              ? (emailModal.clientId.contactInfo?.email ?? "")
              : ""
          }
        />
      )}

      {/* Send Payment Link Modal */}
      {sendPaymentLinkModal && (
        <SendPaymentLinkModal
          isOpen={!!sendPaymentLinkModal}
          onClose={() => setSendPaymentLinkModal(null)}
          invoiceId={sendPaymentLinkModal._id}
          invoiceNumber={sendPaymentLinkModal.invoiceNumber}
          defaultEmail={
            typeof sendPaymentLinkModal.clientId === "object"
              ? (sendPaymentLinkModal.clientId.contactInfo?.email ?? "")
              : ""
          }
          defaultPhone={
            typeof sendPaymentLinkModal.clientId === "object"
              ? (sendPaymentLinkModal.clientId.contactInfo?.phone ?? "")
              : ""
          }
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

      {/* Toggle Status Confirm */}
      <ConfirmModal
        isOpen={!!toggleStatusDialog}
        onOpenChange={(open) => !open && setToggleStatusDialog(null)}
        title={`Mark as ${toggleStatusDialog?.isPaid ? "Pending" : "Paid"}`}
        description={`Are you sure you want to mark invoice ${toggleStatusDialog?.invoiceNumber} as ${toggleStatusDialog?.isPaid ? "Pending" : "Paid"}?`}
        confirmText={`Yes, Mark as ${toggleStatusDialog?.isPaid ? "Pending Payment" : "Paid"}`}
        cancelText="Cancel"
        onConfirm={() => {
          if (toggleStatusDialog) {
            toggleStatusMutation.mutate(toggleStatusDialog._id, {
              onSuccess: () => setToggleStatusDialog(null),
            });
          }
        }}
        variant="primary"
        icon={toggleStatusDialog?.isPaid ? AlertCircle : CheckCircle}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  );
}
