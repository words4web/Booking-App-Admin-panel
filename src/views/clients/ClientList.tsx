"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Filter, MoreVertical } from "lucide-react";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import {
  useAllClientsQuery,
  useDeleteClientMutation,
} from "@/src/services/clientManager/useClientQueries";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Client } from "@/src/types/client.types";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";

export function ClientList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  // Fetch clients with filters
  const { data: clientsData, isLoading: isClientsLoading } = useAllClientsQuery(
    {
      companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
      page,
      limit: PAGINATION_LIMIT,
    },
  );

  const clients = clientsData?.clients || [];
  const pagination = clientsData?.pagination;

  // Fetch companies for filter (Super Admin only)
  const { data: companiesData2 } = useAllCompaniesQuery(1, 100);
  const companies = companiesData2?.companies || [];

  const deleteMutation = useDeleteClientMutation();

  const handleDeleteClick = (client: Client) => {
    setSelectedClient({
      id: client._id,
      name:
        `${client.contactInfo.firstName || ""} ${client.contactInfo.lastName || ""}`.trim() ||
        client.legalDetails.legalName ||
        "Valued Customer",
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      deleteMutation.mutate(selectedClient.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedClient(null);
        },
      });
    }
  };

  if (isClientsLoading) {
    return <CommonLoader />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Client <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              Manage your client database
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {isSuperAdmin && (
              <div className="w-[200px]">
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}>
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
              <Link href={ROUTES_PATH.CLIENTS.NEW}>
                <Plus className="h-5 w-5" />
                Add New Client
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight">
            Client List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!clients || clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No clients found.
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href={ROUTES_PATH.CLIENTS.NEW}>
                  Register your first client
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm font-medium">
                  <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Contact Person
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Legal Entity
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Address
                      </th>
                      {isSuperAdmin && (
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          Company
                        </th>
                      )}
                      <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {clients.map((client) => (
                      <tr
                        key={client._id}
                        className="transition-all hover:bg-slate-50 cursor-default">
                        <td className="px-8 py-5 align-middle">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">
                              {`${client.contactInfo.firstName || ""} ${client.contactInfo.lastName || ""}`.trim() ||
                                "Valued Customer"}
                            </span>
                            <span className="text-[10px] text-muted-foreground lowercase">
                              {client.contactInfo.email}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {client.contactInfo.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {client.legalDetails.legalName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Reg: {client.legalDetails.registrationNumber}
                            </span>
                            {client.legalDetails.vatRegistered && (
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider">
                                VAT: {client.legalDetails.vatNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 align-middle">
                          <div className="flex flex-col text-xs text-muted-foreground max-w-[200px]">
                            <span>{client.address.addressLine1}</span>
                            <span>
                              {client.address.city}, {client.address.postcode}
                            </span>
                            <span>{client.address.country}</span>
                          </div>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-8 py-5 align-middle">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                              {typeof client.companyId === "object"
                                ? client.companyId.name
                                : "Unknown"}
                            </span>
                          </td>
                        )}
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
                              className="w-40 rounded-xl border-border bg-white p-1.5 shadow-xl">
                              <DropdownMenuItem
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                asChild>
                                <Link
                                  href={ROUTES_PATH.CLIENTS.EDIT(client._id)}>
                                  <Pencil className="h-4 w-4 text-slate-500" />
                                  Edit Client
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                onClick={() => handleDeleteClick(client)}>
                                <Trash2 className="h-4 w-4" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
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
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Client"
        description={`Are you sure you want to remove ${selectedClient?.name}? This action cannot be undone.`}
        confirmText="Remove Client"
        cancelText="Keep Client"
        onConfirm={confirmDelete}
        variant="destructive"
        icon={Trash2}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
