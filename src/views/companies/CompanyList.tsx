"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Landmark,
  CreditCard,
  Hash,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import {
  useAllCompaniesQuery,
  useDeleteCompanyMutation,
} from "@/src/services/companyManager/useCompanyQueries";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CompanyList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { data: companiesData, isLoading } = useAllCompaniesQuery(
    page,
    PAGINATION_LIMIT,
  );
  const companies = companiesData?.companies || [];
  const pagination = companiesData?.pagination;
  const deleteMutation = useDeleteCompanyMutation();

  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  // Filter companies based on role
  const filteredCompanies = isSuperAdmin
    ? companies
    : companies?.filter((c) => c._id === user?.companyId);

  const handleDeleteClick = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCompany) {
      deleteMutation.mutate(selectedCompany.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedCompany(null);
        },
      });
    }
  };

  if (isLoading) {
    return <CommonLoader />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Company <span className="text-primary">Profiles</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              Manage your network of transport companies
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              asChild
              className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 gap-2">
              <Link href={ROUTES_PATH.COMPANIES.NEW}>
                <Plus className="h-5 w-5" />
                Register New Company
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight">
            Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!filteredCompanies || filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No companies registered yet.
              </p>
              {isSuperAdmin && (
                <Button asChild variant="link" className="mt-2">
                  <Link href={ROUTES_PATH.COMPANIES.NEW}>
                    Register your first company
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {isSuperAdmin ? (
                <div className="relative w-full overflow-auto">
                  <table className="w-full text-sm font-medium">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border/50">
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          Company Details
                        </th>
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          Reg Number
                        </th>
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          VAT Info
                        </th>
                        <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                          Admin Email
                        </th>
                        {isSuperAdmin && (
                          <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredCompanies.map((company) => (
                        <tr
                          key={company._id}
                          className="transition-all hover:bg-slate-50 cursor-default">
                          <td className="px-8 py-5 align-middle">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">
                                {company.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                                {company.invoicePrefix}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 align-middle text-muted-foreground font-semibold">
                            {company.registrationNumber}
                          </td>
                          <td className="px-8 py-5 align-middle">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-foreground">
                                {company.vatNumber}
                              </span>
                              <span
                                className={`text-[9px] uppercase font-bold tracking-widest ${company.vatRegistered ? "text-primary" : "text-slate-500"}`}>
                                {company.vatRegistered
                                  ? "Registered"
                                  : "Not Registered"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 align-middle">
                            <code className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {company.adminEmail}
                            </code>
                          </td>
                          {isSuperAdmin && (
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
                                <DropdownMenuContent align="end" className="w-44 rounded-xl border-border bg-white p-1.5 shadow-xl">
                                  <DropdownMenuItem
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-slate-50 focus:text-primary"
                                    asChild
                                  >
                                    <Link href={ROUTES_PATH.COMPANIES.EDIT(company._id)}>
                                      <Pencil className="h-4 w-4 text-slate-500" />
                                      Edit Company
                                    </Link>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                    onClick={() =>
                                      handleDeleteClick({
                                        id: company._id,
                                        name: company.name,
                                      })
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Company
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 sm:p-12 bg-slate-50/30 flex flex-col items-center">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      {/* Hero Section */}
                      <Card className="relative overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white rounded-[2.5rem]">
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-emerald-400" />
                        <CardContent className="p-8 sm:p-12">
                          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-primary">
                                Company Profile
                              </div>
                              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                {company.name}
                              </h2>
                              <div className="flex flex-wrap gap-4 items-center text-slate-500 font-bold">
                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                                  <Hash className="h-4 w-4 text-primary" />
                                  <span className="text-sm">
                                    Prefix: {company.invoicePrefix}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                                  <Mail className="h-4 w-4 text-primary" />
                                  <span className="text-sm">
                                    {company.adminEmail}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-inner border border-white">
                              <Building2 className="h-12 w-12 sm:h-16 sm:w-16" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Legal & Tax Details */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                          <CardHeader className="border-b border-slate-50 px-8 py-6">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                              Legal & Tax
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-8 space-y-6">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Registration Number
                              </p>
                              <p className="text-lg font-bold text-slate-800">
                                {company.registrationNumber}
                              </p>
                            </div>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50">
                              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                VAT Reference
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-slate-800">
                                  {company.vatNumber}
                                </p>
                                <span
                                  className={`text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full ${company.vatRegistered ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                  {company.vatRegistered
                                    ? "Registered"
                                    : "Not Registered"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Financial / Bank Details */}
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                          <CardHeader className="border-b border-slate-50 px-8 py-6">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                              Banking Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Landmark className="h-5 w-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                  Bank Name
                                </p>
                                <p className="font-bold text-slate-800">
                                  {company.bankName || "Not Provided"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                  Account Number
                                </p>
                                <p className="font-bold text-slate-800 tracking-[0.1em]">
                                  {company.bankAccountNumber ||
                                    "•••• •••• ••••"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Pencil className="h-5 w-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                  Sort Code / Swift / BIC
                                </p>
                                <p className="font-bold text-slate-800 uppercase">
                                  {company.bankCode || "Not Provided"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
        title="Delete Company Profile"
        description={`Are you sure you want to remove ${selectedCompany?.name}? This action will permanently delete the company and its associated admin account. This cannot be undone.`}
        confirmText="Remove Partner"
        cancelText="Keep Profile"
        onConfirm={confirmDelete}
        variant="destructive"
        icon={Trash2}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
