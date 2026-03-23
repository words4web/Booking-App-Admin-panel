import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { ProductFormData } from "@/src/types/product.types";

interface PricingInfoTabProps {
  formik: FormikProps<ProductFormData>;
  getFieldError: (fieldPath: string) => string | null;
}

export function PricingInfoTab({ formik, getFieldError }: PricingInfoTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <Label
            htmlFor="basePrice"
            className="text-xs font-semibold text-slate-600">
            Base Price (£)
          </Label>
          <Input
            id="basePrice"
            type="number"
            step="any"
            min={0}
            placeholder="0.00"
            {...formik.getFieldProps("basePrice")}
            onChange={(e) => formik.setFieldValue("basePrice", e.target.value)}
            className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("basePrice") ? "border-destructive" : ""}`}
          />
          {getFieldError("basePrice") && (
            <p className="text-xs text-destructive">
              {getFieldError("basePrice")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="baseCharge"
            className="text-xs font-semibold text-slate-600">
            Base Charge (£)
          </Label>
          <Input
            id="baseCharge"
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            {...formik.getFieldProps("baseCharge")}
            onChange={(e) => formik.setFieldValue("baseCharge", e.target.value)}
            className="h-11 rounded-lg border-border"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="hourlyRate"
            className="text-xs font-semibold text-slate-600">
            Hourly Rate (£)
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            {...formik.getFieldProps("hourlyRate")}
            onChange={(e) => formik.setFieldValue("hourlyRate", e.target.value)}
            className="h-11 rounded-lg border-border"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 max-w-sm",
          formik.values.vatApplicable
            ? "bg-primary/5 border-primary/20"
            : "bg-slate-50 border-slate-200",
        )}>
        <div className="space-y-0.5">
          <Label
            htmlFor="vatApplicable"
            className="text-sm font-bold cursor-pointer">
            VAT Applicable
          </Label>
          <p className="text-[11px] text-slate-500 font-medium text-nowrap">
            Charge VAT for this product
          </p>
        </div>
        <Switch
          id="vatApplicable"
          checked={formik.values.vatApplicable}
          onCheckedChange={(checked) =>
            formik.setFieldValue("vatApplicable", checked)
          }
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Extra Charges</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              formik.setFieldValue("extraCharges", [
                ...formik.values.extraCharges,
                { label: "", amount: 0 },
              ])
            }
            className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/5 font-bold text-[10px] uppercase tracking-wider">
            <Plus className="h-3 w-3 mr-1" /> Add Charge
          </Button>
        </div>

        <div className="space-y-3">
          {formik.values.extraCharges.map((_, index) => (
            <div
              key={index}
              className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-1 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">
                  Label
                </Label>
                <Input
                  placeholder="e.g. Congestion Charge"
                  {...formik.getFieldProps(`extraCharges.${index}.label`)}
                  className="h-10 rounded-lg border-border"
                />
              </div>
              <div className="w-32 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">
                  Amount (£)
                </Label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  {...formik.getFieldProps(`extraCharges.${index}.amount`)}
                  onChange={(e) =>
                    formik.setFieldValue(
                      `extraCharges.${index}.amount`,
                      e.target.value,
                    )
                  }
                  className="h-10 rounded-lg border-border"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  formik.setFieldValue(
                    "extraCharges",
                    formik.values.extraCharges.filter((__, i) => i !== index),
                  )
                }
                className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formik.values.extraCharges.length === 0 && (
            <p className="text-xs text-slate-400 italic">
              No extra charges defined.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
