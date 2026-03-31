"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  MoreVertical,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  useBookingsQuery,
  useDeleteBookingMutation,
} from "@/src/services/bookingManager/useBookingQueries";
import { Booking } from "@/src/types/booking.types";
import { BookingStatus } from "@/src/enums/booking.enum";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/src/hooks/useDebounce";
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
} from "@/components/ui/dropdown-menu";
import { InvoiceService } from "@/src/services/invoiceManager/invoice.service";

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.SCHEDULED]: "Scheduled",
  [BookingStatus.ACCEPTED]: "Accepted",
  [BookingStatus.JOB_STARTED]: "Job Started",
  [BookingStatus.JOB_SUBMITTED]: "Job Submitted",
  [BookingStatus.JOB_REJECTED]: "Job Rejected",
  [BookingStatus.COMPLETED]: "Completed",
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  [BookingStatus.SCHEDULED]: "bg-amber-50 text-amber-700 border-amber-200",
  [BookingStatus.ACCEPTED]: "bg-primary/10 text-primary border-primary/20",
  [BookingStatus.JOB_STARTED]: "bg-primary/10 text-primary border-primary/20",
  [BookingStatus.JOB_SUBMITTED]: "bg-primary/10 text-primary border-primary/20",
  [BookingStatus.JOB_REJECTED]: "bg-red-50 text-red-700 border-red-200",
  [BookingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function getClientName(clientId: Booking["clientId"]): string {
  return `${clientId.legalDetails?.legalName ?? ""}`.trim();
}

function getDriverName(driverId: Booking["assignedDriverId"]): string {
  if (!driverId) return "—";
  if (typeof driverId === "string") return driverId;
  return driverId.fullName || "—";
}

function formatDateTime(dt: string) {
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const tableHeaderCss =
  "h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70";

export function BookingList() {
  const [deleteDialog, setDeleteDialog] = useState<{
    id: string;
    bookingId: string;
  } | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const router = useRouter();

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data, isLoading } = useBookingsQuery({
    page,
    limit: PAGINATION_LIMIT,
    companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
    status: (selectedStatus === "all" ? undefined : selectedStatus) as any,
    search: debouncedSearchTerm || undefined,
  });

  // Fetch companies for filter (Super Admin only)
  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const deleteMutation = useDeleteBookingMutation();

  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination;

  const handleInvoiceClick = async (bookingId: string) => {
    try {
      setLoadingInvoiceId(bookingId);
      const invoicesResponse = await InvoiceService.getAll({ bookingId });

      if (invoicesResponse.invoices && invoicesResponse.invoices.length > 0) {
        // Invoice exists, go to edit
        router.push(
          ROUTES_PATH.INVOICES.EDIT(invoicesResponse.invoices[0]._id),
        );
      } else {
        // No invoice, go to create
        router.push(ROUTES_PATH.INVOICES.NEW_WITH_BOOKING(bookingId));
      }
    } catch (error) {
      // Fallback to new
      router.push(ROUTES_PATH.INVOICES.NEW_WITH_BOOKING(bookingId));
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  // Removed global loader to let inline loader work

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
              Booking <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest leading-none">
              Manage transport bookings
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center flex-1 lg:justify-end">
            <div className="relative w-full lg:max-w-xs group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="h-11 pl-10 pr-10 rounded-xl border-border/80 bg-white focus:bg-white transition-all shadow-sm group-hover:border-primary/50 text-sm"
              />
              <div
                title="Search by Booking ID, Client Name, or Client Email"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-help text-slate-400 hover:text-primary transition-colors">
                <Info className="h-4 w-4" />
              </div>
            </div>

            {isSuperAdmin && (
              <div className="w-full lg:w-40">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(val) => {
                    setSelectedCompanyId(val);
                    setPage(1);
                  }}>
                  <SelectTrigger className="h-11 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm">
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

            <div className="w-full lg:w-40">
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setPage(1);
                }}>
                <SelectTrigger className="h-11 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              asChild
              className="w-full sm:w-auto px-5 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2">
              <Link href={ROUTES_PATH.BOOKINGS.NEW}>
                <Plus className="h-5 w-5" />
                Add Booking
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight">
            Booking List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Loading bookings...
              </p>
            </div>
          ) : bookings?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No bookings found.
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href={ROUTES_PATH.BOOKINGS.NEW}>
                  Create your first booking
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm font-medium">
                  <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                      <th className={tableHeaderCss}>Booking ID</th>
                      <th className={tableHeaderCss}>Client</th>
                      {isSuperAdmin && (
                        <th
                          className={`${tableHeaderCss} hidden lg:table-cell`}>
                          Company
                        </th>
                      )}
                      <th className={tableHeaderCss}>Scheduled</th>
                      <th className={tableHeaderCss}>Status</th>
                      <th className={`${tableHeaderCss} hidden md:table-cell`}>
                        Driver
                      </th>
                      <th className={`${tableHeaderCss} text-right`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {bookings?.map((booking) => {
                      const status = booking?.status as BookingStatus;
                      return (
                        <tr
                          key={booking?._id}
                          onClick={() =>
                            router.push(
                              ROUTES_PATH.BOOKINGS.EDIT(booking?._id || ""),
                            )
                          }
                          className="transition-all hover:bg-slate-50 cursor-pointer">
                          <td className="px-4 md:px-8 py-5 align-middle">
                            <span className="font-bold text-foreground whitespace-nowrap">
                              {booking?.bookingId}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground">
                            {getClientName(booking?.clientId)}
                          </td>
                          {isSuperAdmin && (
                            <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground hidden lg:table-cell">
                              {typeof booking?.companyId === "object"
                                ? (booking.companyId as { name: string }).name
                                : "—"}
                            </td>
                          )}
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground whitespace-nowrap">
                            {formatDateTime(booking?.scheduledDateTime)}
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle">
                            <Badge
                              variant="outline"
                              className={`text-xs font-bold rounded-full px-3 ${STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground border-border whitespace-nowrap"}`}>
                              {STATUS_LABELS[status] ?? status}
                            </Badge>
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-muted-foreground hidden md:table-cell">
                            {getDriverName(booking?.assignedDriverId)}
                          </td>
                          <td className="px-4 md:px-8 py-5 align-middle text-right">
                            <div onClick={(e) => e.stopPropagation()}>
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
                                  className="w-48 rounded-xl border-border bg-white p-1.5 shadow-xl">
                                  <DropdownMenuItem
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                    onClick={() =>
                                      handleInvoiceClick(booking?._id || "")
                                    }
                                    disabled={
                                      loadingInvoiceId === booking?._id
                                    }>
                                    {loadingInvoiceId === booking?._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-slate-500" />
                                    )}
                                    Invoice
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                    onClick={() =>
                                      router.push(
                                        ROUTES_PATH.BOOKINGS.EDIT(
                                          booking?._id || "",
                                        ),
                                      )
                                    }>
                                    <Pencil className="h-4 w-4 text-slate-500" />
                                    Edit Booking
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                    onClick={() =>
                                      setDeleteDialog({
                                        id: booking?._id,
                                        bookingId: booking?.bookingId,
                                      })
                                    }>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

      <ConfirmModal
        isOpen={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Delete Booking"
        description={`Are you sure you want to delete booking ${deleteDialog?.bookingId ?? ""}? This action cannot be undone.`}
        confirmText="Delete Booking"
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
