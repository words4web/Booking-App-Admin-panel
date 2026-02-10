"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";

const mockCompanies = [
  {
    id: "1",
    name: "ABC Logistics Ltd",
    regNo: "12345678",
    vatNo: "GB123456789",
    vatRegistered: true,
    adminUsername: "admin_abc",
  },
  {
    id: "2",
    name: "XYZ Transport Co",
    regNo: "87654321",
    vatNo: "GB987654321",
    vatRegistered: true,
    adminUsername: "admin_xyz",
  },
  {
    id: "3",
    name: "Quick Delivery Inc",
    regNo: "11223344",
    vatNo: "N/A",
    vatRegistered: false,
    adminUsername: "admin_quick",
  },
];

export function CompanyList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCompany) {
      console.log(`Deleting company ${selectedCompany.id}`);
      // Add actual delete logic here
      setDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Company <span className="text-primary">Profiles</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              Manage your network of transport companies
            </p>
          </div>
          <Button
            asChild
            className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 gap-2">
            <Link href="/companies/new">
              <Plus className="h-5 w-5" />
              Register New Company
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight">
            Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                    Admin User
                  </th>
                  <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {mockCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="transition-all hover:bg-slate-50 cursor-default">
                    <td className="px-8 py-5 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {company.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                          UID: {company.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 align-middle text-muted-foreground font-semibold">
                      {company.regNo}
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground">{company.vatNo}</span>
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
                        {company.adminUsername}
                      </code>
                    </td>
                    <td className="px-8 py-5 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md border-border hover:bg-slate-100 text-slate-600 shadow-sm"
                          asChild
                          title="Edit Company">
                          <Link href={`/companies/${company.id}/edit`}>
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
                              id: company.id,
                              name: company.name,
                            })
                          }>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Company Profile"
        description={`Are you sure you want to remove ${selectedCompany?.name}? This action will permanently delete all associated logistic records and cannot be undone.`}
        confirmText="Remove Partner"
        cancelText="Keep Profile"
        onConfirm={confirmDelete}
        variant="destructive"
        icon={Trash2}
      />
    </div>
  );
}
