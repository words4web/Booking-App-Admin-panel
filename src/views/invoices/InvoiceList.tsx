"use client";

import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Mail,
  Link2,
  MoreVertical,
  Search,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/src/hooks/useDebounce";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    (clientId.legalDetails?.legalName ??
      `${clientId.contactInfo?.firstName ?? ""} ${clientId.contactInfo?.lastName ?? ""}`.trim()) ||
    "Valued Customer"
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
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { user } = useAuth();
  const router = useRouter();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data, isLoading } = useInvoicesQuery({
    page,
    limit: PAGINATION_LIMIT,
    companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
    search: debouncedSearchTerm || undefined,
  });

  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const deleteMutation = useDeleteInvoiceMutation();
  const toggleStatusMutation = useToggleInvoicePaymentMutation();

  const invoices = data?.invoices ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
              Invoice <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest">
              {pagination
                ? `${pagination.total} invoice${pagination.total !== 1 ? "s" : ""} total`
                : "Manage your invoices"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1 sm:justify-end">
            <div className="relative w-full sm:max-w-xs group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                className="h-12 pl-10 pr-10 rounded-xl border-border/80 bg-white focus:bg-white transition-all shadow-sm group-hover:border-primary/50 text-sm"
              />
              <div
                title="Search by Invoice # or Client Legal Name"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-help text-slate-400 hover:text-primary transition-colors">
                <Info className="h-4 w-4" />
              </div>
            </div>

            {isSuperAdmin && (
              <div className="w-full sm:w-[180px]">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(val) => {
                    setSelectedCompanyId(val);
                    setPage(1);
                  }}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="Company" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies?.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              asChild
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2">
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
          {isLoading ? (
            <CommonLoader fullScreen={false} message="Loading invoices..." />
          ) : invoices.length === 0 ? (
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
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Invoice #
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Client
                      </th>
                      {isSuperAdmin && (
                        <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden lg:table-cell">
                          Company
                        </th>
                      )}
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">
                        Due Date
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Status
                      </th>
                      <th className="h-14 px-4 md:px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Amount
                      </th>
                      <th className="h-14 px-4 md:px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {invoices?.map((inv) => {
                      return (
                        <tr
                          key={inv?._id}
                          className="transition-all hover:bg-slate-50 cursor-pointer group/row"
                          onClick={() =>
                            router.push(ROUTES_PATH.INVOICES.EDIT(inv?._id))
                          }>
                          <td className="px-4 md:px-8 py-5 align-middle">
                            <span className="font-bold text-foreground whitespace-nowrap">
                              {inv?.invoiceNumber}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground whitespace-nowrap">
                            {getClientName(inv?.clientId)}
                          </td>
                          {isSuperAdmin && (
                            <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                              {typeof inv?.companyId === "object"
                                ? (inv?.companyId as { name: string })?.name
                                : "—"}
                            </td>
                          )}
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                            {formatDate(inv?.invoiceDate)}
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground hidden md:table-cell whitespace-nowrap">
                            {inv?.dueDate ? formatDate(inv?.dueDate) : "—"}
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap tracking-wider border ${
                                inv?.isPaid
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}>
                              {inv?.isPaid ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Paid
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-right font-bold text-foreground whitespace-nowrap">
                            £{Number(inv?.totalAmount || 0)?.toFixed(2)}
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-right border-l border-border/10!">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPdfInvoice(inv);
                                  }}>
                                  <FileText className="h-4 w-4 text-slate-500" />
                                  View PDF
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 ${
                                    inv?.isPaid
                                      ? "text-emerald-600 focus:text-emerald-700"
                                      : "text-amber-600 focus:text-amber-700"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setToggleStatusDialog(inv);
                                  }}>
                                  {inv?.isPaid ? (
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEmailModal(inv);
                                  }}>
                                  <Mail className="h-4 w-4 text-primary" />
                                  Send via Email
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSendPaymentLinkModal(inv);
                                  }}>
                                  <Link2 className="h-4 w-4 text-primary" />
                                  Send Payment Link
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-border/50" />

                                {/* <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                  asChild
                                  onClick={(e) => e.stopPropagation()}>
                                  <Link href={`/invoices/${inv?._id}/edit`}>
                                    <Pencil className="h-4 w-4 text-slate-500" />
                                    Edit Invoice
                                  </Link>
                                </DropdownMenuItem> */}

                                <DropdownMenuItem
                                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDialog({
                                      id: inv?._id,
                                      number: inv?.invoiceNumber,
                                    });
                                  }}>
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
