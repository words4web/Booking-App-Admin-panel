"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Landmark,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Save,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CompanyFormData } from "@/src/types/forms.types";

interface CompanyFormProps {
  onSubmit?: (data: CompanyFormData) => void;
}

export function CompanyForm({ onSubmit }: CompanyFormProps) {
  const formik = useFormik<CompanyFormData>({
    initialValues: {
      name: "",
      registrationNumber: "",
      vatNumber: "",
      vatRegistered: true,
      invoicePrefix: "INV",
      bankAccountNumber: "",
      bankCode: "",
      adminUsername: "",
    },
    onSubmit: (values) => {
      try {
        console.log("Company form submitted:", values);
        toast.success("Company registration successful!");
        onSubmit?.(values);
      } catch (error) {
        toast.error("Critical: Company registration failed");
      }
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
            Register New <span className="text-primary">Company</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          Provide the required details to initialize a new company profile.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Section 1: Company Identity */}
        <Card className="border shadow-sm bg-white rounded-xl overflow-hidden ring-1 ring-border/50">
          <CardHeader className="bg-slate-50 border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                Company Identity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
                />
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Financial & Tax */}
        <Card className="border shadow-sm bg-white rounded-xl overflow-hidden ring-1 ring-border/50">
          <CardHeader className="bg-slate-50 border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                Financial & Tax Data
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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
                    disabled={!formik.values.vatRegistered}
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
                  className="h-11 rounded-lg border-border focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Admin Access */}
        <Card className="border shadow-sm bg-white rounded-xl overflow-hidden ring-1 ring-border/50 border-l-4 border-l-primary">
          <CardHeader className="bg-primary/5 border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
                Administrative Access
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1.5">
              <Label
                htmlFor="adminUsername"
                className="text-xs font-semibold text-slate-600">
                Default Admin Username
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary font-bold">
                  @
                </div>
                <Input
                  id="adminUsername"
                  placeholder="e.g., master_admin"
                  {...formik.getFieldProps("adminUsername")}
                  className={`h-11 pl-8 rounded-lg border-border font-bold text-slate-700 transition-all focus:ring-primary focus:border-primary ${getFieldError("adminUsername") ? "border-destructive font-bold" : ""}`}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                * This user will have root control over the company profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Controls */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => formik.resetForm()}
            className="h-11 px-6 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all gap-2 text-xs uppercase tracking-wide">
            <RotateCcw className="h-4 w-4" />
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="h-11 px-8 rounded-lg font-bold text-sm uppercase tracking-wider shadow-md shadow-primary/10 transition-all gap-2">
            <Save className="h-4 w-4" />
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
}
