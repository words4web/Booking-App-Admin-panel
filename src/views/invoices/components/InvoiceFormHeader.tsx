import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormikProps } from "formik";
import { InvoiceFormData } from "@/src/types/invoice.types";

interface InvoiceFormHeaderProps {
  formik: FormikProps<InvoiceFormData>;
  availableLogos: string[];
}

export const InvoiceFormHeader: React.FC<InvoiceFormHeaderProps> = ({
  formik,
  availableLogos,
}) => {
  return (
    <div className="mb-6 flex gap-6 items-start">
      <div className="flex-1">
        <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
          Invoice Logo
        </Label>
        <Select
          value={formik.values.logoFile || "RKB-CCONCRETE-LTD-LOGO.png"}
          onValueChange={(v) => formik.setFieldValue("logoFile", v)}>
          <SelectTrigger className="w-full h-10 rounded-lg border-gray-300 bg-white text-sm">
            <SelectValue placeholder="Select logo" />
          </SelectTrigger>
          <SelectContent className="w-[--radix-select-trigger-width] bg-white border border-gray-200">
            {availableLogos.map((logo) => (
              <SelectItem key={logo} value={logo}>
                {logo
                  .replace(/\.(png|jpg|jpeg|svg|webp)$/i, "")
                  .replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Logo Preview */}
      <div className="w-48 h-20 bg-gray-50 border border-gray-200 rounded-lg hidden sm:flex items-center justify-center p-2 overflow-hidden">
        {formik.values.logoFile ? (
          <img
            src={`/${formik.values.logoFile}`}
            alt="Logo Preview"
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/200x80?text=Preview+Error";
            }}
          />
        ) : (
          <span className="text-xs text-gray-400">No Logo Selected</span>
        )}
      </div>
    </div>
  );
};
