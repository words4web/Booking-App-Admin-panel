import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { ClientFormData } from "@/src/types/client.types";

interface LegalInfoTabProps {
  formik: FormikProps<ClientFormData>;
  getFieldError: (fieldPath: string) => string | null;
  handleNext: () => void;
  handleBack: () => void;
  isSuperAdmin: boolean;
  companies: any[];
  mode: "create" | "edit";
}

export function LegalInfoTab({
  formik,
  getFieldError,
  handleNext,
  handleBack,
  isSuperAdmin,
  companies,
  mode,
}: LegalInfoTabProps) {
  return (
    <TabsContent
      value="legal"
      className="mt-0 focus-visible:outline-none space-y-8">
      <div className="space-y-6">
        {isSuperAdmin && (
          <div className="space-y-2 w-full">
            <Label
              htmlFor="companyId"
              className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Assign Company / Organization{" "}
              {isSuperAdmin && <span className="text-destructive">*</span>}
            </Label>
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("companyId", value)
              }
              value={formik.values.companyId}
              disabled={mode === "edit" && !isSuperAdmin}>
              <SelectTrigger
                className={`w-full h-12 rounded-xl border-border/80 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm ${getFieldError("companyId") ? "border-destructive" : ""}`}>
                <div className="flex items-center gap-3 w-full">
                  <Building2 className="h-5 w-5 text-primary" />
                  <SelectValue placeholder="Select the company to assign this client" />
                </div>
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)] bg-white border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100]">
                {companies?.map((company) => (
                  <SelectItem
                    key={company?._id}
                    value={company?._id}
                    className="text-slate-700 font-semibold focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer py-4 px-4 mb-1 transition-colors">
                    {company?.name}
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
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              e.g., Acme Corp Ltd
            </p>
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
              {...formik.getFieldProps("legalDetails.registrationNumber")}
              className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("legalDetails.registrationNumber") ? "border-destructive" : ""}`}
            />
            {getFieldError("legalDetails.registrationNumber") && (
              <p className="text-xs text-destructive">
                {getFieldError("legalDetails.registrationNumber")}
              </p>
            )}
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              e.g., 01234567
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="legalDetails.purchaseOrderNumber"
              className="text-xs font-semibold text-slate-600">
              Purchase Order Number
            </Label>
            <Input
              id="legalDetails.purchaseOrderNumber"
              placeholder="PO-123456"
              {...formik.getFieldProps("legalDetails.purchaseOrderNumber")}
              className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("legalDetails.purchaseOrderNumber") ? "border-destructive" : ""}`}
            />
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              e.g., PO-123456
            </p>
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
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                e.g., GB123456789
              </p>
              {getFieldError("legalDetails.vatNumber") && (
                <p className="text-xs text-destructive">
                  {getFieldError("legalDetails.vatNumber")}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                formik.setFieldValue("legalDetails.vatRegistered", checked);
                formik.setFieldValue("vatExempt", !checked);
                if (!checked) {
                  formik.setFieldValue("legalDetails.vatNumber", "");
                }
              }}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          <div
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
              formik.values.vatExempt
                ? "bg-amber-50/50 border-amber-200 ring-4 ring-amber-50"
                : "bg-slate-50 border-slate-200",
            )}>
            <div className="space-y-0.5">
              <Label
                htmlFor="vatExempt"
                className={cn(
                  "text-sm font-bold select-none transition-colors cursor-pointer",
                  formik.values.vatExempt ? "text-amber-700" : "text-slate-900",
                )}>
                VAT Exempt
              </Label>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Toggle if client is exempt from VAT charges
              </p>
            </div>
            <Switch
              id="vatExempt"
              checked={formik.values.vatExempt}
              onCheckedChange={(checked) => {
                formik.setFieldValue("vatExempt", checked);
                formik.setFieldValue("legalDetails.vatRegistered", !checked);
                if (checked) {
                  formik.setFieldValue("legalDetails.vatNumber", "");
                }
              }}
              className="data-[state=checked]:bg-amber-600"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
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
  );
}
