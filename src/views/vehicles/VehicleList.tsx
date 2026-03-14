"use client";

import { Pencil, Trash2, Plus, Truck, MoreVertical } from "lucide-react";
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
import {
  useVehiclesQuery,
  useDeleteVehicleMutation,
} from "@/src/services/vehicleManager/useVehicleQueries";
import ROUTES_PATH from "@/lib/Route_Paths";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { useState } from "react";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";

export function VehicleList() {
  const [page, setPage] = useState(1);
  const {
    data: vehiclesData,
    isLoading,
    error,
  } = useVehiclesQuery(page, PAGINATION_LIMIT);
  const vehicles = vehiclesData?.vehicles || [];
  const pagination = vehiclesData?.pagination;
  const deleteMutation = useDeleteVehicleMutation();
  const [vehicleToDelete, setVehicleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (isLoading) {
    return <CommonLoader fullScreen={false} message="Loading vehicles..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching vehicles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <Button
          asChild
          className="rounded-2xl px-6 py-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
          <Link href={ROUTES_PATH.VEHICLES.NEW}>
            <Plus className="h-5 w-5" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">All Vehicles</CardTitle>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Manage your fleet and vehicle details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="h-14 px-8 text-left align-middle font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    Vehicle Name
                  </th>
                  <th className="h-14 px-8 text-left align-middle font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    Vehicle Number
                  </th>
                  <th className="h-14 px-8 text-right align-middle font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {!vehicles || vehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-12 text-center text-slate-400 font-medium bg-white">
                      <div className="flex flex-col items-center gap-3">
                        <Truck className="h-12 w-12 opacity-20" />
                        <p>
                          No vehicles found. Add your first vehicle to get
                          started.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b border-slate-50 transition-all hover:bg-primary/5 group">
                      <td className="px-8 py-5 align-middle">
                        <span className="font-bold text-slate-700 block text-base group-hover:text-primary transition-colors">
                          {vehicle.vehicleName}
                        </span>
                      </td>
                      <td className="px-8 py-5 align-middle">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>
                      <td className="px-8 py-5 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-slate-100"
                            >
                              <MoreVertical className="h-4 w-4 text-slate-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl border-border bg-white p-1.5 shadow-xl">
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                              asChild
                            >
                              <Link href={ROUTES_PATH.VEHICLES.EDIT(vehicle._id)}>
                                <Pencil className="h-4 w-4 text-slate-500" />
                                Edit Vehicle
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                              onClick={() =>
                                setVehicleToDelete({
                                  id: vehicle._id,
                                  name: vehicle.vehicleName,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Vehicle
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

      <ConfirmModal
        isOpen={!!vehicleToDelete}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
        title="Delete Vehicle"
        description={`Are you sure you want to delete the vehicle "${vehicleToDelete?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (vehicleToDelete) {
            deleteMutation.mutate(vehicleToDelete.id, {
              onSuccess: () => setVehicleToDelete(null),
            });
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
