"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Filter, Package, MoreVertical } from "lucide-react";
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
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Product } from "@/src/types/product.types";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "@/src/services/productManager/useProductQueries";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { PAGINATION_LIMIT } from "@/src/constants/pagination";

export function ProductList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  // Fetch products with optional company filter
  const { data: productsData, isLoading: isProductsLoading } =
    useAllProductsQuery({
      companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
      page,
      limit: PAGINATION_LIMIT,
    });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  // Fetch companies for filter (Super Admin only)
  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const deleteMutation = useDeleteProductMutation();

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct({
      id: product._id,
      name: product.name,
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  if (isProductsLoading) {
    return <CommonLoader />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground text-nowrap">
              Product <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 uppercase tracking-widest">
              Manage items and services for billing
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
              <Link href={ROUTES_PATH.PRODUCTS.NEW}>
                <Plus className="h-5 w-5" />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl ring-1 ring-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-bold tracking-tight">
            Product Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No products found.
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href={ROUTES_PATH.PRODUCTS.NEW}>
                  Create your first product
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
                        Product Name
                      </th>
                      <th className="h-14 px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Description
                      </th>
                      <th className="h-14 px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Base Price
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
                    {products.map((product: Product) => (
                      <tr
                        key={product._id}
                        className="transition-all hover:bg-slate-50 cursor-default">
                        <td className="px-8 py-6 align-middle">
                          <span className="font-bold text-foreground block">
                            {product.name}
                          </span>
                        </td>
                        <td className="px-8 py-6 align-middle">
                          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                            {product.description}
                          </span>
                        </td>
                        <td className="px-8 py-6 align-middle text-right">
                          <span className="font-bold text-primary">
                            £{product.basePrice.toFixed(2)}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-8 py-6 align-middle">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-tighter">
                              {typeof product.companyId === "object"
                                ? product.companyId.name
                                : "N/A"}
                            </span>
                          </td>
                        )}
                        <td className="px-8 py-6 align-middle text-right">
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
                                <Link href={ROUTES_PATH.PRODUCTS.EDIT(product._id)}>
                                  <Pencil className="h-4 w-4 text-slate-500" />
                                  Edit Product
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Product
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
        title="Delete Product"
        description={`Are you sure you want to remove "${selectedProduct?.name}"? This will hide it from the inventory.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        icon={Trash2}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
