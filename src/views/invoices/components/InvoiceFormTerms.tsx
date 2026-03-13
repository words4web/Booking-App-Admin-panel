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
          className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Add payment terms or conditions..."
          {...formik.getFieldProps("terms")}
        />
      </div>

      {/* Billing & Company Detail Overrides */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          Address & Billing Details (Overrides)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Bill To: Legal Name
              </Label>
              <Input
                placeholder="Client Legal Name"
                {...formik.getFieldProps("billingName")}
                className="h-10 rounded-lg border-gray-300 bg-white text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Bill To: Full Address
              </Label>
              <textarea
                className="w-full min-h-[80px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter full billing address..."
                {...formik.getFieldProps("billingAddress")}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                From: Company Address
              </Label>
              <textarea
                className="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
