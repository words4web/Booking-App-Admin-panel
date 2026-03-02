"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { BookingSchema } from "@/src/schemas/validationSchemas";
import {
  BookingFormData,
  IBookingProduct,
  Booking,
} from "@/src/types/booking.types";
import { ServiceType } from "@/src/enums/booking.enum";
import { useAllClientsQuery } from "@/src/services/clientManager/useClientQueries";
import { useAllProductsQuery } from "@/src/services/productManager/useProductQueries";
import { useAllDriversQuery } from "@/src/services/driverManager/useDriverQueries";
import { useVehiclesQuery } from "@/src/services/vehicleManager/useVehicleQueries";
import { useAuth } from "@/src/services/authManager";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Package, Truck } from "lucide-react";

// Import tab components
import { DetailsTab } from "./tabs/DetailsTab";
import { LocationsTab } from "./tabs/LocationsTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { AssignmentTab } from "./tabs/AssignmentTab";
import { CompletionReviewTab } from "./tabs/CompletionReviewTab";
import { BookingStatus } from "@/src/enums/booking.enum";
import { ClipboardCheck } from "lucide-react";

const tabClassName =
  "rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm";
interface BookingFormProps {
  initialData?: Booking;
  onSubmit: (values: BookingFormData) => void;
  isLoading?: boolean;
}

export function BookingForm({
  initialData,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useAuth();

  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const formik = useFormik<BookingFormData>({
    initialValues: {
      companyId:
        typeof initialData?.companyId === "string"
          ? initialData.companyId
          : (initialData?.companyId as { _id: string })?._id ||
            user?.companyId ||
            "",
      clientId:
        typeof initialData?.clientId === "string"
          ? initialData.clientId
          : initialData?.clientId?._id || "",
      serviceType: initialData?.serviceType || ServiceType.RMC,
      scheduledDateTime: initialData?.scheduledDateTime
        ? new Date(initialData.scheduledDateTime).toISOString().slice(0, 16)
        : "",
      pickupLocation: {
        addressLine1: initialData?.pickupLocation?.addressLine1 || "",
        addressLine2: initialData?.pickupLocation?.addressLine2 || "",
        city: initialData?.pickupLocation?.city || "",
        county: initialData?.pickupLocation?.county || "",
        postcode: initialData?.pickupLocation?.postcode || "",
        country: initialData?.pickupLocation?.country || "United Kingdom",
      },
      dropLocation: {
        addressLine1: initialData?.dropLocation?.addressLine1 || "",
        addressLine2: initialData?.dropLocation?.addressLine2 || "",
        city: initialData?.dropLocation?.city || "",
        county: initialData?.dropLocation?.county || "",
        postcode: initialData?.dropLocation?.postcode || "",
        country: initialData?.dropLocation?.country || "United Kingdom",
      },
      products:
        initialData?.products?.map((p) => ({
          productId:
            typeof p.productId === "string"
              ? p.productId
              : (p.productId as { _id: string })?._id || "",
          name: p.name,
          quantity: p.quantity,
          rate: p.rate,
          baseCharge: p.baseCharge,
          hourlyRate: p.hourlyRate,
        })) || [],
      assignedDriverId:
        typeof initialData?.assignedDriverId === "string"
          ? initialData.assignedDriverId
          : initialData?.assignedDriverId?._id || "",
      vehicleId:
        typeof initialData?.vehicleId === "string"
          ? initialData.vehicleId
          : initialData?.vehicleId?._id || "",
      jobDetails: initialData?.jobDetails || "",
    },
    validationSchema: toFormikValidationSchema(BookingSchema),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Client filtering based on company
  const { data: filteredClientsData } = useAllClientsQuery({
    companyId: formik.values.companyId,
  });
  const filteredClients = filteredClientsData?.clients || [];

  const { data: productsData } = useAllProductsQuery({ getAll: true });
  const { data: driversData } = useAllDriversQuery(1, 200);
  const { data: vehiclesData } = useVehiclesQuery(1, 200);

  const products = productsData?.products || [];
  const drivers = driversData?.drivers || [];
  const vehicles = vehiclesData?.vehicles || [];

  const handleCompanyChange = (companyId: string) => {
    formik.setFieldValue("companyId", companyId);
    formik.setFieldValue("clientId", ""); // Reset client when company changes
  };

  const getFieldError = (name: string): string | null => {
    const error = formik.errors as Record<string, any>;
    const touched = formik.touched as Record<string, any>;

    if (name.includes(".")) {
      const parts = name.split(".");
      return touched[parts[0]]?.[parts[1]] ? error[parts[0]]?.[parts[1]] : null;
    }
    return touched[name] ? error[name] : null;
  };

  const addProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const existingProductIndex = formik.values.products.findIndex(
      (p) => p.productId === productId,
    );

    if (existingProductIndex !== -1) {
      const updatedProducts = [...formik.values.products];
      updatedProducts[existingProductIndex].quantity += 1;
      formik.setFieldValue("products", updatedProducts);
    } else {
      const newProduct: IBookingProduct = {
        productId: product._id,
        name: product.name,
        quantity: 1,
        rate: product.basePrice,
        baseCharge: product.baseCharge,
        hourlyRate: product.hourlyRate,
        extraCharges: product.extraCharges,
      };

      formik.setFieldValue("products", [...formik.values.products, newProduct]);
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = [...formik.values.products];
    newProducts.splice(index, 1);
    formik.setFieldValue("products", newProducts);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {initialData ? "Edit Booking" : "Create New Booking"}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Setup job details, locations, and pricing.
          </p>
        </div>
        <div className="flex gap-3">
          {initialData?.status === BookingStatus.SCHEDULED ||
          initialData?.status === BookingStatus.ACCEPTED ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-6 h-11 font-bold"
                onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20">
                {isLoading
                  ? "Saving..."
                  : initialData
                    ? "Update Booking"
                    : "Confirm Booking"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6 h-11 font-bold"
              onClick={() => window.history.back()}>
              Back
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide mb-8">
          <TabsList
            className={`inline-flex min-w-max w-full sm:w-auto h-14 p-1 bg-slate-100 rounded-2xl`}>
            <TabsTrigger value="details" className={tabClassName}>
              <Calendar className="h-4 w-4 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger value="locations" className={tabClassName}>
              <MapPin className="h-4 w-4 mr-2" /> Locations
            </TabsTrigger>
            <TabsTrigger value="products" className={tabClassName}>
              <Package className="h-4 w-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="driver" className={tabClassName}>
              <Truck className="h-4 w-4 mr-2" /> Assignment
            </TabsTrigger>
            {(initialData?.status === BookingStatus.JOB_SUBMITTED ||
              initialData?.status === BookingStatus.JOB_REJECTED ||
              initialData?.status === BookingStatus.COMPLETED) && (
              <TabsTrigger value="review" className={tabClassName}>
                <ClipboardCheck className="h-4 w-4 mr-2" /> Review
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {activeTab === "details" && (
              <DetailsTab
                formik={formik}
                clients={filteredClients}
                getFieldError={getFieldError}
                companies={companies}
                userRole={user?.role}
                onCompanyChange={handleCompanyChange}
              />
            )}
            {activeTab === "locations" && <LocationsTab formik={formik} />}
            {activeTab === "products" && (
              <ProductsTab
                formik={formik}
                products={products}
                addProduct={addProduct}
                removeProduct={removeProduct}
              />
            )}
            {activeTab === "driver" && (
              <AssignmentTab
                formik={formik}
                drivers={drivers}
                vehicles={vehicles}
              />
            )}
            {activeTab === "review" && initialData && (
              <CompletionReviewTab booking={initialData} />
            )}
          </CardContent>
        </Card>
      </Tabs>
    </form>
  );
}
