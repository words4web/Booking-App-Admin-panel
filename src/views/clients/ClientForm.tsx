"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ClientSchema } from "@/src/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, RotateCcw, Save, Loader2, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ClientFormData, Client } from "@/src/types/client.types";
import { ClientTabsData } from "@/lib/ClientTabsData";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";

interface ClientFormProps {
  mode?: "create" | "edit";
  initialData?: Client;
  onSubmit: (data: ClientFormData) => void;
  isPending?: boolean;
}

export function ClientForm({
  mode = "create",
  initialData,
  onSubmit,
  isPending = false,
}: ClientFormProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;
  const [activeTab, setActiveTab] = useState("contact");

  const tabOrder = ["contact", "legal", "address"];

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

  // Fetch companies for Super Admin dropdown
  const { data: companies = [] } = useAllCompaniesQuery();

  const formik = useFormik<ClientFormData>({
    initialValues: {
      companyId:
        (typeof initialData?.companyId === "string"
          ? initialData.companyId
          : initialData?.companyId?._id) || "",
      contactInfo: {
        firstName: initialData?.contactInfo.firstName || "",
        lastName: initialData?.contactInfo.lastName || "",
        email: initialData?.contactInfo.email || "",
        phone: initialData?.contactInfo.phone || "",
      },
      legalDetails: {
        legalName: initialData?.legalDetails.legalName || "",
        registrationNumber: initialData?.legalDetails.registrationNumber || "",
        vatNumber: initialData?.legalDetails.vatNumber || "",
        vatRegistered: initialData?.legalDetails.vatRegistered ?? false,
      },
      address: {
        addressLine1: initialData?.address.addressLine1 || "",
        addressLine2: initialData?.address.addressLine2 || "",
        city: initialData?.address.city || "",
        state: initialData?.address.state || "",
        postalCode: initialData?.address.postalCode || "",
        country: initialData?.address.country || "",
      },
    },
    validationSchema: toFormikValidationSchema(ClientSchema),
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: (values) => {
      // Clean up VAT number if not registered
      if (!values.legalDetails.vatRegistered) {
        values.legalDetails.vatNumber = "";
      }
      onSubmit(values);
    },
  });

  const getFieldError = (fieldPath: string) => {
    const meta = formik.getFieldMeta(fieldPath);
    return meta.touched && meta.error ? meta.error : null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Register New" : "Edit"}{" "}
            <span className="text-primary">Client</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          {mode === "create"
            ? "Provide the required details to add a new client."
            : "Update the client profile details."}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem]">
          <Tabs value={activeTab} className="w-full">
            <div className="px-8 pt-8">
              <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-fit">
                {ClientTabsData.map((data) => (
                  <TabsTrigger
                    key={data.id}
                    value={data.id}
                    className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg pointer-events-none">
                    {data.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <CardContent className="p-8">
              {/* Tab 1: Contact Info */}
              <TabsContent
                value="contact"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contactInfo.firstName"
                      className="text-xs font-semibold text-slate-600">
                      First Name
                    </Label>
                    <Input
                      id="contactInfo.firstName"
                      placeholder="John"
                      {...formik.getFieldProps("contactInfo.firstName")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("contactInfo.firstName") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("contactInfo.firstName") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("contactInfo.firstName")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contactInfo.lastName"
                      className="text-xs font-semibold text-slate-600">
                      Last Name
                    </Label>
                    <Input
                      id="contactInfo.lastName"
                      placeholder="Doe"
                      {...formik.getFieldProps("contactInfo.lastName")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("contactInfo.lastName") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("contactInfo.lastName") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("contactInfo.lastName")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contactInfo.email"
                      className="text-xs font-semibold text-slate-600">
                      Email Address
                    </Label>
                    <Input
                      id="contactInfo.email"
                      type="email"
                      placeholder="john.doe@example.com"
                      {...formik.getFieldProps("contactInfo.email")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("contactInfo.email") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("contactInfo.email") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("contactInfo.email")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contactInfo.phone"
                      className="text-xs font-semibold text-slate-600">
                      Phone Number (UK Format)
                    </Label>
                    <Input
                      id="contactInfo.phone"
                      placeholder="e.g., 07123 456789 or +44 7123 456789"
                      {...formik.getFieldProps("contactInfo.phone")}
                      onChange={(e) => {
                        let val = e.target.value;
                        // Strip non-valid chars (only allow + at the start and digits)
                        val = val.replace(/[^\d+]/g, "");
                        if (val.startsWith("+")) {
                          val = "+" + val.slice(1).replace(/\+/g, "");
                        } else {
                          val = val.replace(/\+/g, "");
                        }

                        // Apply UK Formatting
                        // Format: +44 XXXX XXXXXX or 0XXXX XXXXXX
                        if (val.startsWith("+44")) {
                          const digits = val.slice(3).replace(/\D/g, "");
                          if (digits.length > 4) {
                            val = `+44 ${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
                          } else if (digits.length > 0) {
                            val = `+44 ${digits}`;
                          }
                        } else if (val.startsWith("0")) {
                          const digits = val.replace(/\D/g, "");
                          if (digits.length > 5) {
                            val = `${digits.slice(0, 5)} ${digits.slice(5, 11)}`;
                          }
                        }

                        formik.setFieldValue("contactInfo.phone", val.trim());
                      }}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("contactInfo.phone") ? "border-destructive" : ""}`}
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      Accepts UK mobile or landline formats (+44 or 0 prefix)
                    </p>
                    {getFieldError("contactInfo.phone") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("contactInfo.phone")}
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

              {/* Tab 2: Legal & Business */}
              <TabsContent
                value="legal"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="space-y-6">
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
                            <SelectValue placeholder="Select the company to assign this client" />
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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="legalDetails.legalName"
                        className="text-xs font-semibold text-slate-600">
                        Legal Entity Name
                      </Label>
                      <Input
                        id="legalDetails.legalName"
                        placeholder="Acme Corp Ltd."
                        {...formik.getFieldProps("legalDetails.legalName")}
                        className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("legalDetails.legalName") ? "border-destructive" : ""}`}
                      />
                      {getFieldError("legalDetails.legalName") && (
                        <p className="text-xs text-destructive">
                          {getFieldError("legalDetails.legalName")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="legalDetails.registrationNumber"
                        className="text-xs font-semibold text-slate-600">
                        Registration Number
                      </Label>
                      <Input
                        id="legalDetails.registrationNumber"
                        placeholder="Reg No. 123456"
                        {...formik.getFieldProps(
                          "legalDetails.registrationNumber",
                        )}
                        className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("legalDetails.registrationNumber") ? "border-destructive" : ""}`}
                      />
                      {getFieldError("legalDetails.registrationNumber") && (
                        <p className="text-xs text-destructive">
                          {getFieldError("legalDetails.registrationNumber")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                      formik.values.legalDetails.vatRegistered
                        ? "bg-emerald-50/50 border-emerald-200 ring-4 ring-emerald-50"
                        : "bg-slate-50 border-slate-200",
                    )}>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="vatRegistered"
                        className={cn(
                          "text-sm font-bold select-none transition-colors cursor-pointer",
                          formik.values.legalDetails.vatRegistered
                            ? "text-emerald-700"
                            : "text-slate-900",
                        )}>
                        VAT Registered Status
                      </Label>
                      <p className="text-[11px] text-slate-500 font-medium leading-none">
                        Toggle if client is registered for VAT
                      </p>
                    </div>
                    <Switch
                      id="vatRegistered"
                      checked={formik.values.legalDetails.vatRegistered}
                      onCheckedChange={(checked) => {
                        formik.setFieldValue(
                          "legalDetails.vatRegistered",
                          checked,
                        );
                        if (!checked) {
                          formik.setFieldValue("legalDetails.vatNumber", "");
                        }
                      }}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>

                  {formik.values.legalDetails.vatRegistered && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="legalDetails.vatNumber"
                        className="text-xs font-semibold text-slate-600">
                        VAT Number
                      </Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="legalDetails.vatNumber"
                          placeholder="VAT123456789"
                          {...formik.getFieldProps("legalDetails.vatNumber")}
                          className={`h-11 pl-10 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("legalDetails.vatNumber") ? "border-destructive" : ""}`}
                        />
                      </div>
                      {getFieldError("legalDetails.vatNumber") && (
                        <p className="text-xs text-destructive">
                          {getFieldError("legalDetails.vatNumber")}
                        </p>
                      )}
                    </div>
                  )}
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

              {/* Tab 3: Address */}
              <TabsContent
                value="address"
                className="mt-0 focus-visible:outline-none space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label
                      htmlFor="address.addressLine1"
                      className="text-xs font-semibold text-slate-600">
                      Address Line 1
                    </Label>
                    <Input
                      id="address.addressLine1"
                      placeholder="Street Address, P.O. Box"
                      {...formik.getFieldProps("address.addressLine1")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.addressLine1") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("address.addressLine1") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("address.addressLine1")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label
                      htmlFor="address.addressLine2"
                      className="text-xs font-semibold text-slate-600">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="address.addressLine2"
                      placeholder="Apartment, Suite, Unit, etc."
                      {...formik.getFieldProps("address.addressLine2")}
                      className="h-11 rounded-lg border-border focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address.city"
                      className="text-xs font-semibold text-slate-600">
                      City
                    </Label>
                    <Input
                      id="address.city"
                      placeholder="City"
                      {...formik.getFieldProps("address.city")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.city") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("address.city") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("address.city")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address.state"
                      className="text-xs font-semibold text-slate-600">
                      State / Province
                    </Label>
                    <Input
                      id="address.state"
                      placeholder="State"
                      {...formik.getFieldProps("address.state")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.state") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("address.state") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("address.state")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address.postalCode"
                      className="text-xs font-semibold text-slate-600">
                      Postal Code
                    </Label>
                    <Input
                      id="address.postalCode"
                      placeholder="Postal Code"
                      {...formik.getFieldProps("address.postalCode")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.postalCode") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("address.postalCode") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("address.postalCode")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address.country"
                      className="text-xs font-semibold text-slate-600">
                      Country
                    </Label>
                    <Input
                      id="address.country"
                      placeholder="Country"
                      {...formik.getFieldProps("address.country")}
                      className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.country") ? "border-destructive" : ""}`}
                    />
                    {getFieldError("address.country") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("address.country")}
                      </p>
                    )}
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
                    type="submit"
                    disabled={
                      formik.isSubmitting ||
                      !formik.isValid ||
                      isPending ||
                      (isSuperAdmin && !formik.values.companyId)
                    }
                    className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md shadow-primary/10 transition-all gap-2">
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {mode === "create" ? "Register Client" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Global Form Reset */}
        {activeTab === "contact" && (
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
