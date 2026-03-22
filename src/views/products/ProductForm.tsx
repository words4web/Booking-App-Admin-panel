"use client";

import { useFormik } from "formik";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { getProductSchema } from "@/src/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2, Package, ArrowRight, ArrowLeft } from "lucide-react";
import { ProductFormData, Product } from "@/src/types/product.types";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfoTab } from "./components/GeneralInfoTab";
import { PricingInfoTab } from "./components/PricingInfoTab";
import { toast } from "react-toastify";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("general");

  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const formik = useFormik<ProductFormData>({
    initialValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      unitType: initialData?.unitType || ("Per Trip" as any),
      basePrice: initialData?.basePrice || 0,
      baseCharge: initialData?.baseCharge || 0,
      hourlyRate: initialData?.hourlyRate || 0,
      extraCharges: initialData?.extraCharges || [],
      vatApplicable: initialData?.vatApplicable ?? true,
      companyId:
        (typeof initialData?.companyId === "string"
          ? initialData.companyId
          : initialData?.companyId?._id) || "",
    },
    validationSchema: toFormikValidationSchema(getProductSchema(isSuperAdmin)),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    formik.setTouched({
      ...formik.touched,
      name: true,
      description: true,
      companyId: true,
    });

    const errors = await formik.validateForm();
    if (
      !errors.name &&
      !errors.description &&
      (!isSuperAdmin || !errors.companyId)
    ) {
      setActiveTab("pricing");
    } else {
      toast.error("Please fill in the required fields before proceeding.");
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("general");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (activeTab === "general") {
      handleNext(e as any);
      return;
    }

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);

      // Switch tab based on error location
      if (errors.name || errors.description || errors.companyId) {
        setActiveTab("general");
      } else if (errors.basePrice || errors.extraCharges) {
        setActiveTab("pricing");
      }

      toast.error("Please fill in all required fields correctly.");

      formik.setTouched({
        name: true,
        description: true,
        companyId: true,
        basePrice: true,
      });
      return;
    }

    formik.handleSubmit(e);
  };

  const getFieldError = (fieldPath: string) => {
    const meta = formik.getFieldMeta(fieldPath);
    return (meta.touched || formik.submitCount > 0) && meta.error
      ? meta.error
      : null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-nowrap">
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

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full">
              <div className="px-8 pt-8">
                <TabsList className="mb-8 p-1.5 bg-slate-100/50 rounded-2xl w-full grid grid-cols-2 h-auto">
                  <TabsTrigger
                    value="general"
                    className="rounded-xl py-3 text-xs uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 pointer-events-none">
                    <Package className="h-4 w-4 mr-2" />
                    General Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="pricing"
                    className="rounded-xl py-3 text-xs uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 pointer-events-none">
                    <Save className="h-4 w-4 mr-2" />
                    Pricing & VAT
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8 pt-0">
                <TabsContent value="general" className="mt-0">
                  <GeneralInfoTab
                    formik={formik}
                    isSuperAdmin={isSuperAdmin}
                    companies={companies}
                    mode={mode}
                    getFieldError={getFieldError}
                  />
                </TabsContent>

                <TabsContent value="pricing" className="mt-0">
                  <PricingInfoTab
                    formik={formik}
                    getFieldError={getFieldError}
                  />
                </TabsContent>

                <div className="flex justify-between items-center pt-8">
                  <div className="flex-1">
                    {activeTab === "pricing" && (
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="ghost"
                        className="h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-all gap-2 group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {activeTab === "general" ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-12 px-10 rounded-xl font-bold text-sm uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all gap-2 group">
                        Next Step
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isPending}
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
                    )}
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
