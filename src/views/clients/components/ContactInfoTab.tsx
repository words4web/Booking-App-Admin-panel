import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { FormikProps } from "formik";
import { ClientFormData } from "@/src/types/client.types";

interface ContactInfoTabProps {
  formik: FormikProps<ClientFormData>;
  getFieldError: (fieldPath: string) => string | null;
  handleNext: () => void;
}

export function ContactInfoTab({
  formik,
  getFieldError,
  handleNext,
}: ContactInfoTabProps) {
  return (
    <TabsContent
      value="contact"
      className="mt-0 focus-visible:outline-none space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="contactInfo.firstName"
            className="text-xs font-semibold text-slate-600">
            First Name (Optional)
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., John
          </p>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="contactInfo.lastName"
            className="text-xs font-semibold text-slate-600">
            Last Name (Optional)
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., Doe
          </p>
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., john.doe@example.com
          </p>
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., 07123 456789 or +44 7123 456789
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
  );
}
