"use client";
import {
  Eye,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  useAllDriversQuery,
  useDeleteDriverMutation,
} from "@/src/services/driverManager/useDriverQueries";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";
import { useState } from "react";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useRouter } from "next/navigation";

export function DriverList() {
  const [page, setPage] = useState(1);
  const [deleteDriverId, setDeleteDriverId] = useState<string | null>(null);
  const router = useRouter();

  const { data, isLoading, error } = useAllDriversQuery(page, PAGINATION_LIMIT);
  const { mutateAsync: deleteDriver, isPending: isDeleting } =
    useDeleteDriverMutation();

  const handleDelete = async () => {
    if (deleteDriverId) {
      await deleteDriver(deleteDriverId);
      setDeleteDriverId(null);
    }
  };

  const drivers = data?.drivers || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return <CommonLoader fullScreen={false} message="Loading drivers..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching drivers
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
            Driver <span className="text-primary">Partners</span>
          </h1>
          <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest">
            Manage your network of professional drivers
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                    Name
                  </th>
                  <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">
                    Email
                  </th>
                  <th className="h-12 px-2 md:px-4 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                    Phone
                  </th>
                  <th className="h-12 px-2 md:px-4 text-center align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                    Verified
                  </th>
                  <th className="h-12 px-2 md:px-4 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 border-l border-border/10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {!drivers || drivers?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-muted-foreground">
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  drivers?.map((driver) => (
                    <tr
                      key={driver?._id}
                      onClick={() =>
                        router.push(ROUTES_PATH.DRIVERS.VIEW(driver?._id))
                      }
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                      <td className="p-2 md:p-4 align-middle font-bold text-foreground whitespace-nowrap">
                        {driver?.fullName}
                      </td>
                      <td className="p-2 md:p-4 align-middle hidden md:table-cell whitespace-nowrap">
                        {driver?.email}
                      </td>
                      <td className="p-2 md:p-4 align-middle whitespace-nowrap">
                        {driver?.mobileNumber}
                      </td>
                      <td className="p-2 md:p-4 align-middle text-center">
                        {driver?.isDocumentsVerified ? (
                          <div className="flex justify-center items-center text-emerald-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Verified
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center text-amber-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Pending
                            </span>
                          </div>
                        )}
                      </td>
                      <td
                        className="p-2 md:p-4 align-middle text-right border-l border-border/10"
                        onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-muted">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-2xl border-border bg-white p-1.5 shadow-xl">
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                              asChild>
                              <Link
                                href={ROUTES_PATH.DRIVERS.VIEW(driver?._id)}>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl cursor-pointer transition-colors focus:bg-destructive/5 text-destructive"
                              onClick={() => setDeleteDriverId(driver?._id)}>
                              <Trash2 className="h-4 w-4" />
                              Delete Driver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination?.pages > 1 && (
            <div className="flex items-center justify-between px-8 py-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium">
                Page {pagination?.page} of {pagination?.pages}
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
                  disabled={page >= pagination?.pages}
                  className="rounded-lg h-8 text-xs font-bold">
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!deleteDriverId}
        onOpenChange={(open) => !open && setDeleteDriverId(null)}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? All documents and driver details will be deleted permanently. This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
        icon={Trash2}
      />
    </div>
  );
}
