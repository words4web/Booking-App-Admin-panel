import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { UnitType } from "@/src/enums/product.enum";
import { FormikProps } from "formik";
import { ProductFormData } from "@/src/types/product.types";
import { Company } from "@/src/types/company.types";

interface GeneralInfoTabProps {
  formik: FormikProps<ProductFormData>;
  isSuperAdmin: boolean;
  companies: Company[];
  mode: "create" | "edit";
  getFieldError: (fieldPath: string) => string | null;
}

export function GeneralInfoTab({
  formik,
  isSuperAdmin,
  companies,
  mode,
  getFieldError,
}: GeneralInfoTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isSuperAdmin && (
        <div className="space-y-2 w-full">
          <Label
            htmlFor="companyId"
            className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Assign Company / Organization
          </Label>
          <Select
            onValueChange={(value) => formik.setFieldValue("companyId", value)}
            value={formik.values.companyId}
            disabled={mode === "edit" && !isSuperAdmin}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5 lg:col-span-2">
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
            <p className="text-xs text-destructive">{getFieldError("name")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="unitType"
            className="text-xs font-semibold text-slate-600">
            Unit Type
          </Label>
          <Select
            onValueChange={(value) => formik.setFieldValue("unitType", value)}
            value={formik.values.unitType}>
            <SelectTrigger className="w-full h-11 rounded-lg border-border">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-xl w-[var(--radix-select-trigger-width)]">
              {Object.values(UnitType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
    </div>
  );
}
