"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
              <Link href="/companies/new">
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
                  <Link href="/companies/new">Register your first company</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
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
                              className={`text-[9px] uppercase font-bold tracking-widest ${company.vatRegistered ? "text-blue-600" : "text-slate-500"}`}>
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
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                                asChild
                                title="Edit Company">
                                <Link href={`/companies/${company._id}/edit`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Link>
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                title="Delete Company"
                                onClick={() =>
                                  handleDeleteClick({
                                    id: company._id,
                                    name: company.name,
                                  })
                                }>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        )}
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
