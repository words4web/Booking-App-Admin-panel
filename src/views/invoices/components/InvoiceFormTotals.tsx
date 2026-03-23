import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { InvoiceFormData } from "@/src/types/invoice.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Totals {
  productTotal: number;
  subtotal: number;
  totalVat: number;
  totalAmount: number;
}

interface InvoiceFormTotalsProps {
  formik: FormikProps<InvoiceFormData>;
  totals: Totals;
}

export const InvoiceFormTotals: React.FC<InvoiceFormTotalsProps> = ({
  formik,
  totals,
}) => {
  return (
    <div className="flex sm:justify-end">
      <div className="w-full sm:max-w-md lg:max-w-sm space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Product Total</span>
          <span className="font-semibold text-gray-900">
            £{Number(totals.productTotal || 0).toFixed(2)}
          </span>
        </div>

        {/* Waiting Time Section */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Waiting Time
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-slate-400">Minutes</Label>
              <Input
                type="number"
                value={formik.values.waitingMinutes || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  formik.setFieldValue(
                    "waitingMinutes",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="h-8 text-xs bg-white"
              />
            </div>
            <div>
              <Label className="text-[10px] text-slate-400">Cost (£)</Label>
              <Input
                type="number"
                step="0.01"
                value={formik.values.waitingTotal || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  formik.setFieldValue(
                    "waitingTotal",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="0.00"
                className="h-8 text-xs bg-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Night Shift Section */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Night Shift
            </span>
            <div className="flex items-center gap-2">
              <Label className="text-[10px] text-slate-400">Apply</Label>
              <input
                type="checkbox"
                checked={formik.values.isNightShift || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  formik.setFieldValue("isNightShift", checked);
                  if (!checked) {
                    formik.setFieldValue("nightShiftAmount", 0);
                  } else if (
                    !formik.values.nightShiftAmount ||
                    Number(formik.values.nightShiftAmount) === 0
                  ) {
                    formik.setFieldValue("nightShiftAmount", 2);
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
          {formik.values.isNightShift && (
            <div className="grid grid-cols-1 mt-2">
              <div>
                <Label className="text-[10px] text-slate-400">Amount (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formik.values.nightShiftAmount || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue(
                      "nightShiftAmount",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  placeholder="0.00"
                  className="h-8 text-xs bg-white font-bold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Extra Charges Section */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              Extra Charges
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => {
                const current = formik.values.extraCharges || [];
                formik.setFieldValue("extraCharges", [
                  ...current,
                  { label: "New Charge", amount: 0 },
                ]);
              }}
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
          {(formik.values.extraCharges || []).map((charge, idx) => (
            <div key={idx} className="flex gap-2 items-center mt-2">
              <div className="flex-1">
                <Input
                  type="text"
                  value={charge.label}
                  onChange={(e) => {
                    const newVal = [...(formik.values.extraCharges || [])];
                    newVal[idx].label = e.target.value;
                    formik.setFieldValue("extraCharges", newVal);
                  }}
                  className="h-8 text-xs bg-white"
                  placeholder="Charge Name"
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  step="0.01"
                  value={charge.amount || ""}
                  onChange={(e) => {
                    const newVal = [...(formik.values.extraCharges || [])];
                    newVal[idx].amount = e.target.value === "" ? 0 : Number(e.target.value);
                    formik.setFieldValue("extraCharges", newVal);
                  }}
                  className="h-8 text-xs bg-white text-right font-bold"
                  placeholder="0.00"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  const newVal = [...(formik.values.extraCharges || [])];
                  newVal.splice(idx, 1);
                  formik.setFieldValue("extraCharges", newVal);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-[13px] sm:text-sm pt-3 border-t border-slate-200">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            Subtotal
          </span>
          <span className="font-bold text-slate-900">
            £{Number(totals.subtotal || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center text-[13px] sm:text-sm">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            VAT (20%)
          </span>
          <span className="font-semibold text-slate-900">
            £{Number(totals.totalVat || 0).toFixed(2)}
          </span>
        </div>
        <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center">
          <span className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tighter">
            Total Payable
          </span>
          <span className="text-xl sm:text-2xl font-black text-primary">
            £{Number(totals.totalAmount || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
