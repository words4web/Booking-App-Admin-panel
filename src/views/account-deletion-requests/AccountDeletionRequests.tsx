"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  UserX,
  AlertTriangle,
  FileX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  useDeletedByUsersQuery,
  useReviewDeletionMutation,
} from "@/src/services/driverManager/useDriverQueries";
import { Driver } from "@/src/types/driver.types";

type ReviewAction = {
  driver: Driver;
  status: "approved" | "rejected";
} | null;

function DocumentStatus({ label, hasKey }: { label: string; hasKey: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {hasKey ? (
        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
      ) : (
        <FileX className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
      )}
      <span
        className={`text-xs font-semibold ${hasKey ? "text-emerald-700" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}

export function AccountDeletionRequests() {
  const [pendingAction, setPendingAction] = useState<ReviewAction>(null);

  const { data: drivers, isLoading, error } = useDeletedByUsersQuery();
  const { mutateAsync: reviewDeletion, isPending: isReviewing } =
    useReviewDeletionMutation();

  const handleConfirm = async () => {
    if (!pendingAction) return;
    await reviewDeletion({
      id: pendingAction.driver._id,
      status: pendingAction.status,
    });
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <CommonLoader fullScreen={false} message="Loading deletion requests..." />
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching deletion requests.
      </div>
    );
  }

  const isEmpty = !drivers || drivers?.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
            Account <span className="text-destructive">Deletion Requests</span>
          </h1>
          <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest">
            Review and action driver self-deletion requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-sm font-bold border-amber-300 text-amber-700 bg-amber-50">
            {drivers?.length ?? 0} Pending
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            Pending Deletion Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="h-20 w-20 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-xl tracking-tight text-foreground">
                  All Clear
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  No pending account deletion requests.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Driver
                    </th>
                    <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden lg:table-cell">
                      Contact
                    </th>
                    <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">
                      Documents
                    </th>
                    <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                      Requested
                    </th>
                    <th className="h-12 px-2 md:px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 border-l border-border/10">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drivers?.map((driver) => (
                    <tr
                      key={driver?._id}
                      className="border-b transition-colors hover:bg-muted/50">
                      {/* Driver Info */}
                      <td className="p-2 md:p-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-foreground">
                            {driver?.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground lg:hidden">
                            {driver?.email}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-2 md:p-4 align-middle hidden lg:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{driver?.email}</span>
                          <span className="text-xs text-muted-foreground">
                            {driver?.mobileNumber}
                          </span>
                        </div>
                      </td>

                      {/* Document status */}
                      <td className="p-2 md:p-4 align-middle hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <DocumentStatus
                            label="License Front"
                            hasKey={!!driver?.license?.frontImage?.key}
                          />
                          <DocumentStatus
                            label="License Back"
                            hasKey={!!driver?.license?.backImage?.key}
                          />
                          <DocumentStatus
                            label="Passport"
                            hasKey={!!driver?.passport?.passportImage?.key}
                          />
                        </div>
                      </td>

                      {/* Requested at */}
                      <td className="p-2 md:p-4 align-middle">
                        <span className="text-sm text-muted-foreground">
                          {driver?.deletedAt
                            ? format(new Date(driver?.deletedAt), "dd MMM yyyy")
                            : "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="p-2 md:p-4 align-middle text-right border-l border-border/10"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-lg text-xs font-bold border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 gap-1.5"
                            onClick={() =>
                              setPendingAction({ driver, status: "rejected" })
                            }>
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>

                          <Button
                            size="sm"
                            className="h-8 rounded-lg text-xs font-bold bg-destructive hover:bg-destructive/90 gap-1.5"
                            onClick={() =>
                              setPendingAction({ driver, status: "approved" })
                            }>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm modals */}
      <ConfirmModal
        isOpen={pendingAction?.status === "approved"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Approve Account Deletion"
        description={`Are you sure you want to approve the deletion request for ${pendingAction?.driver?.fullName}? All their documents will be permanently deleted from storage. This action cannot be undone.`}
        confirmText="Yes, Approve & Delete Docs"
        onConfirm={handleConfirm}
        isLoading={isReviewing}
        variant="destructive"
        icon={AlertTriangle}
      />

      <ConfirmModal
        isOpen={pendingAction?.status === "rejected"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Reject Account Deletion"
        description={`Are you sure you want to reject the deletion request for ${pendingAction?.driver?.fullName}? Their account will be fully restored and they will be able to log in again.`}
        confirmText="Yes, Restore Account"
        onConfirm={handleConfirm}
        isLoading={isReviewing}
        variant="warning"
        icon={AlertTriangle}
      />
    </div>
  );
}
