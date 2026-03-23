"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  MoreVertical,
  Search,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  // Fetch clients with filters
  const { data: clientsData, isLoading: isClientsLoading } = useAllClientsQuery(
    {
      companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
      search: debouncedSearch,
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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
              Client <span className="text-primary">Profiles</span>
            </h1>
            <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest">
              Manage your corporate and individual clients
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1 sm:justify-end">
            <div className="flex flex-1 gap-2 sm:max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-10 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
              <div className="relative leading-none group">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-white border-border shadow-sm hover:bg-slate-50 transition-all text-muted-foreground hover:text-primary">
                  <Info className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 top-full mt-3 w-64 p-4 bg-white border border-border shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl z-[100] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    Search using client{" "}
                    <span className="text-primary">Name</span>,{" "}
                    <span className="text-primary">Email Address</span>, or{" "}
                    <span className="text-primary">Phone Number</span>.
                  </p>
                  <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white border-t border-l border-border rotate-45" />
                </div>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="w-full sm:w-[200px]">
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-border/80 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="Filter" />
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
              <Link href={ROUTES_PATH.CLIENTS.NEW}>
                <Plus className="h-5 w-5" />
                Add Client
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
          {isClientsLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-b-2xl transition-all duration-300">
              <CommonLoader fullScreen={false} message="Updating Results..." />
            </div>
          )}
          {!clients || clients?.length === 0 ? (
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
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Contact Person
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Legal Entity
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden lg:table-cell">
                        Address
                      </th>
                      {isSuperAdmin && (
                        <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">
                          Company
                        </th>
                      )}
                      <th className="h-14 px-4 md:px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {clients?.map((client) => (
                      <tr
                        key={client?._id}
                        onClick={() =>
                          router.push(ROUTES_PATH.CLIENTS.EDIT(client?._id))
                        }
                        className="transition-all hover:bg-slate-50 cursor-pointer group">
                        <td className="px-4 md:px-8 py-5 align-middle">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground whitespace-nowrap">
                              {`${client?.contactInfo.firstName || ""} ${client?.contactInfo.lastName || ""}`.trim() ||
                                "Valued Customer"}
                            </span>
                            <span className="text-[10px] text-muted-foreground lowercase whitespace-nowrap">
                              {client?.contactInfo.email}
                            </span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {client?.contactInfo.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-5 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground whitespace-nowrap">
                              {client?.legalDetails.legalName}
                            </span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              Reg: {client?.legalDetails.registrationNumber}
                            </span>
                            {client?.legalDetails.vatRegistered && (
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider whitespace-nowrap">
                                VAT: {client?.legalDetails.vatNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-5 align-middle hidden lg:table-cell">
                          <div className="flex flex-col text-xs text-muted-foreground max-w-[200px]">
                            <span>{client?.address.addressLine1}</span>
                            <span>
                              {client?.address.city}, {client?.address.postcode}
                            </span>
                            <span>{client?.address.country}</span>
                          </div>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-4 md:px-8 py-5 align-middle hidden md:table-cell">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700 whitespace-nowrap">
                              {typeof client?.companyId === "object"
                                ? client?.companyId.name
                                : "Unknown"}
                            </span>
                          </td>
                        )}
                        <td className="px-4 md:px-8 py-5 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 rounded-full hover:bg-slate-200">
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
                                  href={ROUTES_PATH.CLIENTS.EDIT(client?._id)}>
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
