import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { InvoiceFormData } from "@/src/types/invoice.types";

interface InvoiceFormTermsProps {
  formik: FormikProps<InvoiceFormData>;
}

export const InvoiceFormTerms: React.FC<InvoiceFormTermsProps> = ({
  formik,
}) => {
  return (
    <>
      {/* Notes & Terms */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
          Terms & Conditions
        </Label>
        <textarea
          className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          placeholder="Add payment terms or conditions..."
          {...formik.getFieldProps("terms")}
        />
      </div>

      {/* Billing & Company Detail Overrides */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          Address & Billing Details (Overrides)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div>
              <Label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">
                Bill To: Legal Name
              </Label>
              <Input
                placeholder="Client Legal Name"
                {...formik.getFieldProps("billingName")}
                className="h-11 rounded-lg border-gray-200 bg-white text-sm shadow-sm"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">
                Bill To: Full Address
              </Label>
              <textarea
                className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Enter full billing address..."
                {...formik.getFieldProps("billingAddress")}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">
                From: Company Address
              </Label>
              <textarea
                className="w-full min-h-[160px] p-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Enter full company address..."
                {...formik.getFieldProps("companyAddress")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
