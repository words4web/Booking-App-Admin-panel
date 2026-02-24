"use client";

import { useFormik } from "formik";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ProductSchema } from "@/src/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, Building2, RotateCcw, Package } from "lucide-react";
import { ProductFormData, Product } from "@/src/types/product.types";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";

interface ProductFormProps {
  mode?: "create" | "edit";
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isPending?: boolean;
}

export function ProductForm({
  mode = "create",
  initialData,
  onSubmit,
  isPending = false,
}: ProductFormProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const { data: companies = [] } = useAllCompaniesQuery();

  const formik = useFormik<ProductFormData>({
    initialValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      basePrice: initialData?.basePrice || 0,
      companyId:
        (typeof initialData?.companyId === "string"
          ? initialData.companyId
          : initialData?.companyId?._id) || "",
    },
    validationSchema: toFormikValidationSchema(ProductSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getFieldError = (fieldPath: string) => {
    const meta = formik.getFieldMeta(fieldPath);
    return meta.touched && meta.error ? meta.error : null;
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Add New" : "Edit"}{" "}
            <span className="text-primary">Product</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          {mode === "create"
            ? "Create a new product or service for billing."
            : "Update the product details."}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10">
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-slate-800">
                    Product Details
                  </h3>
                </div>

                {isSuperAdmin && (
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="companyId"
                      className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Assign Company / Organization
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        formik.setFieldValue("companyId", value)
                      }
                      value={formik.values.companyId}
                      disabled={mode === "edit"}>
                      <SelectTrigger className="w-full h-12 rounded-xl border-border/80 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm">
                        <div className="flex items-center gap-3 w-full">
                          <Building2 className="h-5 w-5 text-primary" />
                          <SelectValue placeholder="Select company" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[var(--radix-select-trigger-width)] bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                        {companies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company._id}
                            className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-4 px-4 mb-1 transition-colors">
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldError("companyId") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("companyId")}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold text-slate-600">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Standard Trip"
                      {...formik.getFieldProps("name")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("name") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("name") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="description"
                      className="text-xs font-semibold text-slate-600">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the service..."
                      className={`min-h-[100px] rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("description") ? "border-destructive" : ""}`}
                      {...formik.getFieldProps("description")}
                    />
                    {getFieldError("description") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("description")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 max-w-[200px]">
                    <Label
                      htmlFor="basePrice"
                      className="text-xs font-semibold text-slate-600">
                      Base Price (£)
                    </Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="1"
                      min={1}
                      placeholder="0.00"
                      {...formik.getFieldProps("basePrice")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("basePrice") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("basePrice") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("basePrice")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => formik.resetForm()}
                  disabled={isPending}
                  className="h-11 px-6 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all gap-2 text-xs uppercase tracking-wide">
                  <RotateCcw className="h-4 w-4" />
                  {mode === "create" ? "Clear" : "Reset"}
                </Button>

                <Button
                  type="submit"
                  disabled={
                    !formik.isValid ||
                    isPending ||
                    (isSuperAdmin && !formik.values.companyId)
                  }
                  className="h-12 px-10 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all gap-2">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "create" ? "Adding..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {mode === "create" ? "Add Product" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
