"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Package,
  MoreVertical,
  Search,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products with optional company filter
  const { data: productsData, isLoading: isProductsLoading } =
    useAllProductsQuery({
      companyId: selectedCompanyId === "all" ? undefined : selectedCompanyId,
      search: debouncedSearch,
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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
              Product <span className="text-primary">Catalog</span>
            </h1>
            <p className="text-muted-foreground font-medium text-[10px] sm:text-sm mt-1 uppercase tracking-widest">
              Manage concrete products and standardized rates
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1 sm:justify-end">
            <div className="flex flex-1 gap-2 sm:max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-normal text-wrap">
                    Search your products using their{" "}
                    <span className="text-primary">Name</span>.
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
              <Link href={ROUTES_PATH.PRODUCTS.NEW}>
                <Plus className="h-5 w-5" />
                Add Product
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
        <CardContent className="p-0 relative">
          {isProductsLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-b-2xl transition-all duration-300">
              <CommonLoader fullScreen={false} message="Updating Results..." />
            </div>
          )}
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
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Product Name
                      </th>
                      <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">
                        Description
                      </th>
                      <th className="h-14 px-4 md:px-8 text-right align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
                        Base Price
                      </th>
                      {isSuperAdmin && (
                        <th className="h-14 px-4 md:px-8 text-left align-middle font-bold text-xs uppercase tracking-widest text-muted-foreground/70 hidden lg:table-cell">
                          Company
                        </th>
                      )}
                      <th className="h-14 px-4 md:px-8 text-right align-middle font-bold text-xs uppercase tracking-widest border-l border-border/10!">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {products.map((product: Product) => (
                      <tr
                        key={product._id}
                        onClick={() =>
                          router.push(ROUTES_PATH.PRODUCTS.EDIT(product._id))
                        }
                        className="transition-all hover:bg-slate-50 cursor-pointer group">
                        <td className="px-4 md:px-8 py-6 align-middle">
                          <span className="font-bold text-foreground block whitespace-nowrap">
                            {product.name}
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-6 align-middle hidden md:table-cell">
                          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                            {product.description}
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-6 align-middle text-right whitespace-nowrap">
                          <span className="font-bold text-primary">
                            £{product.basePrice.toFixed(2)}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-4 md:px-8 py-6 align-middle hidden lg:table-cell">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-tighter whitespace-nowrap">
                              {typeof product.companyId === "object"
                                ? product.companyId.name
                                : "N/A"}
                            </span>
                          </td>
                        )}
                        <td className="px-4 md:px-8 py-6 align-middle text-right border-l border-border/10!">
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
                                  href={ROUTES_PATH.PRODUCTS.EDIT(product._id)}>
                                  <Pencil className="h-4 w-4 text-slate-500" />
                                  Edit Product
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus:bg-red-50 text-red-600 focus:text-red-700"
                                onClick={() => handleDeleteClick(product)}>
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
