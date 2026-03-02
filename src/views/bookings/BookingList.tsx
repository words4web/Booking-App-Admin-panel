"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
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
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  [BookingStatus.ACCEPTED]: "bg-blue-50 text-blue-700 border-blue-200",
  [BookingStatus.JOB_STARTED]: "bg-blue-50 text-blue-700 border-blue-200",
  [BookingStatus.JOB_SUBMITTED]: "bg-blue-50 text-blue-700 border-blue-200",
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
  "h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70";

export function BookingList() {
  const [deleteDialog, setDeleteDialog] = useState<{
    id: string;
    bookingId: string;
  } | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data, isLoading } = useBookingsQuery({
    page,
    limit: PAGINATION_LIMIT,
    companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
  });

  // Fetch companies for filter (Super Admin only)
  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const deleteMutation = useDeleteBookingMutation();

  const bookings = data?.bookings ?? [];
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
              Booking <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              Manage transport bookings
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
              <Link href="/bookings/new">
                <Plus className="h-5 w-5" />
                Create Booking
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
          {bookings?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No bookings found.
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/bookings/new">Create your first booking</Link>
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
                        <th className={tableHeaderCss}>Company</th>
                      )}
                      <th className={tableHeaderCss}>Scheduled</th>
                      <th className={tableHeaderCss}>Status</th>
                      <th className={tableHeaderCss}>Driver</th>
                      <th className={tableHeaderCss}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {bookings?.map((booking) => {
                      const status = booking?.status as BookingStatus;
                      return (
                        <tr
                          key={booking?._id}
                          className="transition-all hover:bg-slate-50 cursor-default">
                          <td className="px-8 py-5 align-middle">
                            <span className="font-bold text-foreground">
                              {booking?.bookingId}
                            </span>
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {getClientName(booking?.clientId)}
                          </td>
                          {isSuperAdmin && (
                            <td className="px-8 py-5 align-middle text-muted-foreground">
                              {typeof booking?.companyId === "object"
                                ? (booking.companyId as { name: string }).name
                                : "—"}
                            </td>
                          )}
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {formatDateTime(booking?.scheduledDateTime)}
                          </td>
                          <td className="px-8 py-5 align-middle">
                            <Badge
                              variant="outline"
                              className={`text-xs font-bold rounded-full px-3 ${STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground border-border"}`}>
                              {STATUS_LABELS[status] ?? status}
                            </Badge>
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground">
                            {getDriverName(booking?.assignedDriverId)}
                          </td>
                          <td className="px-8 py-5 align-middle text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                                asChild
                                title="Edit Booking">
                                <Link href={`/bookings/${booking?._id}/edit`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                title="Delete Booking"
                                onClick={() =>
                                  setDeleteDialog({
                                    id: booking?._id,
                                    bookingId: booking?.bookingId,
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
