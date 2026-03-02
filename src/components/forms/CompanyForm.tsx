"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { CompanySchema } from "@/src/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, RotateCcw, Save, Mail, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CompanyFormData } from "@/src/types/forms.types";
import { CompanyTabsData } from "@/lib/CompanyTabsData";
import { Company } from "@/src/types/company.types";

interface CompanyFormProps {
  mode?: "create" | "edit";
  initialData?: Company;
  onSubmit: (data: CompanyFormData) => void;
  isPending?: boolean;
}

export function CompanyForm({
  mode = "create",
  initialData,
  onSubmit,
  isPending = false,
}: CompanyFormProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;
  const [activeTab, setActiveTab] = useState("identity");

  const tabOrder = ["identity", "financial", "admin"];

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const formik = useFormik<CompanyFormData>({
    initialValues: {
      name: initialData?.name || "",
      registrationNumber: initialData?.registrationNumber || "",
      vatNumber: initialData?.vatNumber || "",
      vatRegistered: initialData?.vatRegistered ?? false,
      invoicePrefix: initialData?.invoicePrefix || "INV",
      bankAccountNumber: initialData?.bankAccountNumber || "",
      bankCode: initialData?.bankCode || "",
      bankName: initialData?.bankName || "",
      adminEmail: initialData?.adminEmail || "",
    },
    validationSchema: toFormikValidationSchema(CompanySchema),
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const getFieldError = (fieldName: keyof CompanyFormData) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Register New" : "Edit"}{" "}
            <span className="text-primary">Company</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          {mode === "create"
            ? "Provide the required details to initialize a new company profile."
            : "Update the company profile details."}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <Tabs value={activeTab} className="w-full">
            <div className="px-8 pt-8">
              <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-fit">
                {CompanyTabsData.map((data) => (
                  <TabsTrigger
                    key={data.id}
                    value={data.id}
                    className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest pointer-events-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                    {data.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <CardContent className="p-8">
              {/* Tab 1: Company Identity */}
              <TabsContent
                value="identity"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold text-slate-600">
                      Company Name
                    </Label>
                    <Input
                      id="name"
                      autoComplete="organization"
                      placeholder="e.g., Global Logistics S.A."
                      {...formik.getFieldProps("name")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("name") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("name") && (
                      <p className="text-xs text-destructive">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="registrationNumber"
                      className="text-xs font-semibold text-slate-600">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      placeholder="Official Reg No."
                      {...formik.getFieldProps("registrationNumber")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("registrationNumber") ? "border-destructive" : ""}`}
                      disabled={!isSuperAdmin}
                    />
                    {getFieldError("registrationNumber") && (
                      <p className="text-xs text-destructive">
                        {formik.errors.registrationNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="invoicePrefix"
                      className="text-xs font-semibold text-slate-600">
                      Invoice Prefix
                    </Label>
                    <Input
                      id="invoicePrefix"
                      placeholder="e.g., GLO"
                      {...formik.getFieldProps("invoicePrefix")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary uppercase ${getFieldError("invoicePrefix") ? "border-destructive" : ""}`}
                      disabled={!isSuperAdmin}
                    />
                    {getFieldError("invoicePrefix") && (
                      <p className="text-xs text-destructive">
                        {formik.errors.invoicePrefix}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 2: Financial & Tax */}
              <TabsContent
                value="financial"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="space-y-6">
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                      formik.values.vatRegistered
                        ? "bg-emerald-50/50 border-emerald-200 ring-4 ring-emerald-50"
                        : "bg-slate-50 border-slate-200",
                    )}>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="vatRegistered"
                        className={cn(
                          "text-sm font-bold select-none transition-colors cursor-pointer",
                          formik.values.vatRegistered
                            ? "text-emerald-700"
                            : "text-slate-900",
                        )}>
                        VAT Registered Status
                      </Label>
                      <p className="text-[11px] text-slate-500 font-medium leading-none">
                        Toggle if this company is registered for VAT
                      </p>
                    </div>
                    <Switch
                      id="vatRegistered"
                      name="vatRegistered"
                      checked={formik.values.vatRegistered}
                      className="data-[state=checked]:bg-emerald-600"
                      onCheckedChange={(checked) => {
                        formik.setFieldValue("vatRegistered", checked);
                        if (!checked) {
                          formik.setFieldValue("vatNumber", "N/A");
                        } else {
                          formik.setFieldValue("vatNumber", "");
                        }
                      }}
                      disabled={!isSuperAdmin}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vatNumber"
                        className="text-xs font-semibold text-slate-600">
                        VAT Reference Number
                      </Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="vatNumber"
                          placeholder="VAT Reg No."
                          disabled={
                            !formik.values.vatRegistered || !isSuperAdmin
                          }
                          {...formik.getFieldProps("vatNumber")}
                          className={`h-11 pl-10 rounded-lg border-border focus:ring-primary focus:border-primary transition-all ${getFieldError("vatNumber") ? "border-destructive border-2" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="bankAccountNumber"
                        className="text-xs font-semibold text-slate-600">
                        Bank Account Number
                      </Label>
                      <Input
                        id="bankAccountNumber"
                        placeholder="Primary Account No."
                        {...formik.getFieldProps("bankAccountNumber")}
                        className="h-11 rounded-lg border-border focus:ring-primary focus:border-primary transition-all"
                        disabled={!isSuperAdmin}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="bankName"
                        className="text-xs font-semibold text-slate-600">
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        placeholder="e.g., Barclays, HSBC"
                        {...formik.getFieldProps("bankName")}
                        className="h-11 rounded-lg border-border focus:ring-primary focus:border-primary transition-all"
                        disabled={!isSuperAdmin}
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor="bankCode"
                        className="text-xs font-semibold text-slate-600">
                        Sort Code / Swift / BIC
                      </Label>
                      <Input
                        id="bankCode"
                        placeholder="Financial Institution Code"
                        {...formik.getFieldProps("bankCode")}
                        className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary transition-all ${getFieldError("bankCode") ? "border-destructive" : ""}`}
                        disabled={!isSuperAdmin}
                      />
                      {getFieldError("bankCode") && (
                        <p className="text-xs text-destructive">
                          {formik.errors.bankCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider">
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 3: Admin Access */}
              <TabsContent
                value="admin"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="adminEmail"
                    className="text-xs font-semibold text-slate-600">
                    Company Admin Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:text-primary transition-colors" />
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="e.g., admin@company.com"
                      disabled={mode === "edit" || !isSuperAdmin}
                      {...formik.getFieldProps("adminEmail")}
                      className={`h-11 pl-10 rounded-lg border-border font-bold text-slate-700 transition-all focus:ring-primary focus:border-primary ${getFieldError("adminEmail") ? "border-destructive font-bold" : ""}`}
                    />
                  </div>
                  {getFieldError("adminEmail") && (
                    <p className="text-xs text-destructive">
                      {formik.errors.adminEmail}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    {mode === "create"
                      ? "* A company admin account will be created with this email. Login credentials will be sent via email."
                      : "* Admin email cannot be changed after creation."}
                  </p>
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider">
                    Previous
                  </Button>
                  {isSuperAdmin && (
                    <Button
                      type="submit"
                      disabled={!formik.isValid || isPending}
                      className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md shadow-primary/10 transition-all gap-2">
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {mode === "create" ? "Creating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {mode === "create"
                            ? "Complete Registration"
                            : "Save Changes"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Global Form Reset */}
        {isSuperAdmin && activeTab === "identity" && (
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => formik.resetForm()}
              disabled={isPending}
              className="h-11 px-6 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all gap-2 text-xs uppercase tracking-wide">
              <RotateCcw className="h-4 w-4" />
              {mode === "create" ? "Clear Form" : "Reset Changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
