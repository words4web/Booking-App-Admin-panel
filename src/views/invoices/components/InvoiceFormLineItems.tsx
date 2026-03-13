import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import {
  InvoiceFormData,
  InvoiceLineFormData,
} from "@/src/types/invoice.types";

interface InvoiceFormLineItemsProps {
  formik: FormikProps<InvoiceFormData>;
  isEdit: boolean;
  getFieldError: (name: string) => string | null;
  removeLine: (index: number) => void;
  setLineField: (index: number, field: string, value: any) => void;
  getVatAmt: (l: InvoiceLineFormData) => number;
}

export const InvoiceFormLineItems: React.FC<InvoiceFormLineItemsProps> = ({
  formik,
  isEdit,
  getFieldError,
  removeLine,
  setLineField,
  getVatAmt,
}) => {
  return (
    <div className="space-y-4">
      {formik.values.lineItems.map((line, idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-lg border border-gray-200 p-5">
          {/* Line header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Line {idx + 1}
            </span>
            {!isEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLine(idx)}
                className="h-7 w-7 text-gray-400 hover:text-red-500 rounded-md">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Line fields - all on one row on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Ex-VAT (Unit Price) */}
            <div>
              <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Ex-VAT (£)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={line.unitPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLineField(idx, "unitPrice", Number(e.target.value))
                }
                className={cn(
                  "h-9 rounded-md border-gray-300 text-sm bg-white",
                  getFieldError(`lineItems.${idx}.unitPrice`) &&
                    "border-destructive",
                )}
              />
              {getFieldError(`lineItems.${idx}.unitPrice`) && (
                <p className="text-[10px] text-destructive font-medium mt-1">
                  {getFieldError(`lineItems.${idx}.unitPrice`)}
                </p>
              )}
            </div>

            {/* VAT Rate - editable as percentage */}
            <div>
              <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                VAT Rate (%)
              </Label>
              <Input
                type="number"
                step="1"
                min="0"
                max="100"
                value={line.vatPercent || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLineField(
                    idx,
                    "vatPercent",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="20"
                className={cn(
                  "h-9 rounded-md border-gray-300 text-sm bg-white",
                  getFieldError(`lineItems.${idx}.vatPercent`) &&
                    "border-destructive",
                )}
              />
              {getFieldError(`lineItems.${idx}.vatPercent`) && (
                <p className="text-[10px] text-destructive font-medium mt-1">
                  {getFieldError(`lineItems.${idx}.vatPercent`)}
                </p>
              )}
            </div>

            {/* VAT Amount (auto-calculated, read-only) */}
            <div>
              <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                VAT (£)
              </Label>
              <div className="h-9 flex items-center px-3 text-sm text-gray-600 bg-gray-100 rounded-md border border-gray-200">
                {Number(getVatAmt(line) || 0).toFixed(2)}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Quantity
              </Label>
              <Input
                type="number"
                min="1"
                step="0.1"
                value={line.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLineField(idx, "quantity", Number(e.target.value))
                }
                className={cn(
                  "h-9 rounded-md border-gray-300 text-sm bg-white",
                  getFieldError(`lineItems.${idx}.quantity`) &&
                    "border-destructive",
                )}
              />
              {getFieldError(`lineItems.${idx}.quantity`) && (
                <p className="text-[10px] text-destructive font-medium mt-1">
                  {getFieldError(`lineItems.${idx}.quantity`)}
                </p>
              )}
            </div>

            {/* Detail (Description) */}
            <div className="col-span-2">
              <Label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Detail
              </Label>
              <Input
                placeholder="Description"
                value={line.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLineField(idx, "description", e.target.value)
                }
                className={cn(
                  "h-9 rounded-md border-gray-300 text-sm bg-white",
                  getFieldError(`lineItems.${idx}.description`) &&
                    "border-destructive",
                )}
              />
              {getFieldError(`lineItems.${idx}.description`) && (
                <p className="text-[10px] text-destructive font-medium mt-1">
                  {getFieldError(`lineItems.${idx}.description`)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
