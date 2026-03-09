"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
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
import { ClipboardCheck, Loader2 } from "lucide-react";
import { InvoiceService } from "@/src/services/invoiceManager/invoice.service";

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
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  const router = useRouter();

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
    const error = formik.errors as any;
    const touched = formik.touched as any;

    if (name.includes(".")) {
      const parts = name.split(".");
      let errVal = error;
      let touchVal = touched;

      for (const part of parts) {
        errVal = errVal?.[part];
        touchVal = touchVal?.[part];
      }
      return touchVal ? (errVal as string) : null;
    }
    return touched[name] ? (error[name] as string) : null;
  };

  const handleConfirmClick = async () => {
    // Touch all important fields to reveal errors
    formik.setTouched({
      companyId: true,
      clientId: true,
      serviceType: true,
      scheduledDateTime: true,
      pickupLocation: {
        addressLine1: true,
        city: true,
        postcode: true,
      },
      dropLocation: {
        addressLine1: true,
        city: true,
        postcode: true,
      },
      products: formik.values.products.map(() => ({
        productId: true,
        quantity: true,
        rate: true,
      })),
    });

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      // If there are errors, we might want to switch to the first tab with errors
      if (
        errors.companyId ||
        errors.clientId ||
        errors.scheduledDateTime ||
        errors.serviceType
      ) {
        setActiveTab("details");
      } else if (errors.pickupLocation || errors.dropLocation) {
        setActiveTab("locations");
      } else if (errors.products) {
        setActiveTab("products");
      }
    }

    formik.handleSubmit();
  };

  const addProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const existingProductIndex = formik.values.products.findIndex(
      (p) => p.productId === productId,
    );

    if (existingProductIndex !== -1) {
      const updatedProducts = [...formik.values.products];
      const currentQty = updatedProducts[existingProductIndex].quantity;
      updatedProducts[existingProductIndex].quantity =
        Number(currentQty || 0) + 1;
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

  const handleInvoiceClick = async () => {
    if (!initialData?._id) return;

    try {
      setIsInvoiceLoading(true);
      const invoicesResponse = await InvoiceService.getAll({
        bookingId: initialData._id,
      });

      if (invoicesResponse.invoices && invoicesResponse.invoices.length > 0) {
        // Invoice exists, go to edit
        router.push(
          ROUTES_PATH.INVOICES.EDIT(invoicesResponse.invoices[0]._id),
        );
      } else {
        // No invoice, go to create
        router.push(ROUTES_PATH.INVOICES.NEW_WITH_BOOKING(initialData._id));
      }
    } catch (error) {
      console.error("Failed to check existing invoices:", error);
      // Fallback to new
      router.push(ROUTES_PATH.INVOICES.NEW_WITH_BOOKING(initialData._id));
    } finally {
      setIsInvoiceLoading(false);
    }
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
          {initialData && (
            <Button
              type="button"
              onClick={handleInvoiceClick}
              disabled={isInvoiceLoading}
              className="rounded-xl px-6 h-11 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 gap-2">
              {isInvoiceLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ClipboardCheck className="h-5 w-5" />
              )}
              {isInvoiceLoading ? "Checking..." : "Create Invoice"}
            </Button>
          )}
          {!initialData ||
          initialData?.status === BookingStatus.SCHEDULED ||
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
                type="button"
                onClick={handleConfirmClick}
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
            {activeTab === "locations" && (
              <LocationsTab formik={formik} getFieldError={getFieldError} />
            )}
            {activeTab === "products" && (
              <ProductsTab
                formik={formik}
                products={products}
                addProduct={addProduct}
                removeProduct={removeProduct}
                getFieldError={getFieldError}
              />
            )}
            {activeTab === "driver" && (
              <AssignmentTab
                formik={formik}
                drivers={drivers}
                vehicles={vehicles}
                getFieldError={getFieldError}
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
