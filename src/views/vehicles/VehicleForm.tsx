"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VehicleSchema } from "@/src/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { CreateVehicleRequest, Vehicle } from "@/src/types/vehicle.types";

interface VehicleFormProps {
  mode?: "create" | "edit";
  initialData?: Vehicle;
  onSubmit: (data: CreateVehicleRequest) => void;
  isPending?: boolean;
}

export function VehicleForm({
  mode = "create",
  initialData,
  onSubmit,
  isPending = false,
}: VehicleFormProps) {
  const formik = useFormik<CreateVehicleRequest>({
    initialValues: {
      vehicleName: initialData?.vehicleName || "",
      vehicleNumber: initialData?.vehicleNumber || "",
    },
    validationSchema: toFormikValidationSchema(VehicleSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getFieldError = (fieldPath: string) => {
    const meta = formik.getFieldMeta(fieldPath);
    return meta.touched && meta.error ? meta.error : null;
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {mode === "create" ? "Add New" : "Edit"}{" "}
          <span className="text-primary">Vehicle</span>
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          {mode === "create"
            ? "Enter the vehicle details below."
            : "Update the vehicle information."}
        </p>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem]">
        <CardHeader className="p-8 pb-4">
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            Specify the name and registration number of the vehicle.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label
                htmlFor="vehicleName"
                className="text-xs font-semibold text-slate-600"
              >
                Vehicle Name
              </Label>
              <Input
                id="vehicleName"
                placeholder="e.g. Mercedes Sprinter"
                {...formik.getFieldProps("vehicleName")}
                className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${
                  getFieldError("vehicleName") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("vehicleName") && (
                <p className="text-xs text-destructive">
                  {getFieldError("vehicleName")}
                </p>
              )}
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                e.g., Mercedes Sprinter
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="vehicleNumber"
                className="text-xs font-semibold text-slate-600"
              >
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                placeholder="e.g. AB12 CDE"
                {...formik.getFieldProps("vehicleNumber")}
                className={`h-11 rounded-lg border-border focus:ring-primary focus:border-primary ${
                  getFieldError("vehicleNumber") ? "border-destructive" : ""
                }`}
              />
              {getFieldError("vehicleNumber") && (
                <p className="text-xs text-destructive">
                  {getFieldError("vehicleNumber")}
                </p>
              )}
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                e.g., AB12 CDE
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => formik.resetForm()}
                disabled={isPending}
                className="h-11 px-6 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-all gap-2 text-xs uppercase tracking-wide"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid || isPending}
                className="h-11 px-8 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md shadow-primary/10 transition-all gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {mode === "create" ? "Add Vehicle" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
