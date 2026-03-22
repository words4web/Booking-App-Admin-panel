import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { FormikProps } from "formik";
import { ClientFormData } from "@/src/types/client.types";

interface AddressInfoTabProps {
  formik: FormikProps<ClientFormData>;
  getFieldError: (fieldPath: string) => string | null;
  handleBack: () => void;
  isPending: boolean;
  mode: "create" | "edit";
}

export function AddressInfoTab({
  formik,
  getFieldError,
  handleBack,
  isPending,
  mode,
}: AddressInfoTabProps) {
  return (
    <TabsContent
      value="address"
      className="mt-0 focus-visible:outline-none space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 col-span-2">
          <div className="space-y-1.5">
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
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              e.g., 123 High Street
            </p>
          </div>

          <div className="space-y-1.5">
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
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              e.g., Flat 1, Building Name
            </p>
          </div>
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., London
          </p>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="address.county"
            className="text-xs font-semibold text-slate-600">
            County (Optional)
          </Label>
          <Input
            id="address.county"
            placeholder="County"
            {...formik.getFieldProps("address.county")}
            className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.county") ? "border-destructive" : ""}`}
          />
          {getFieldError("address.county") && (
            <p className="text-xs text-destructive">
              {getFieldError("address.county")}
            </p>
          )}
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., Greater London
          </p>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="address.postcode"
            className="text-xs font-semibold text-slate-600">
            Postcode
          </Label>
          <Input
            id="address.postcode"
            placeholder="Postcode"
            {...formik.getFieldProps("address.postcode")}
            className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${getFieldError("address.postcode") ? "border-destructive" : ""}`}
          />
          {getFieldError("address.postcode") && (
            <p className="text-xs text-destructive">
              {getFieldError("address.postcode")}
            </p>
          )}
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., SW1A 1AA
          </p>
        </div>

        {/* <div className="space-y-1.5">
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
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            e.g., United Kingdom
          </p>
        </div> */}
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
          disabled={isPending}
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
  );
}
