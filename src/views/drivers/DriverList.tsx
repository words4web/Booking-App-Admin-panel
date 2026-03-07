"use client";
import { Eye, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useAllDriversQuery } from "@/src/services/driverManager/useDriverQueries";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";
import { useState } from "react";
import ROUTES_PATH from "@/lib/Route_Paths";

export function DriverList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAllDriversQuery(page, PAGINATION_LIMIT);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Verified
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {!drivers || drivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-muted-foreground">
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr
                      key={driver._id}
                      className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        {driver.fullName}
                      </td>
                      <td className="p-4 align-middle">{driver.email}</td>
                      <td className="p-4 align-middle">
                        {driver.mobileNumber}
                      </td>
                      <td className="p-4 align-middle text-center">
                        {driver.isDocumentsVerified ? (
                          <div className="flex justify-center items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center text-amber-600">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={ROUTES_PATH.DRIVERS.VIEW(driver._id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
        </CardContent>
      </Card>
    </div>
  );
}
