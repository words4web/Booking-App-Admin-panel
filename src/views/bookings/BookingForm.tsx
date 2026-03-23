"use client";

import { useState, useEffect } from "react";
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
import { BookingStatus, ServiceType } from "@/src/enums/booking.enum";
import dayjs from "dayjs";
import { useAllProductsQuery } from "@/src/services/productManager/useProductQueries";
import { useAllDriversQuery } from "@/src/services/driverManager/useDriverQueries";
import { useVehiclesQuery } from "@/src/services/vehicleManager/useVehicleQueries";
import { useAuth } from "@/src/services/authManager";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, MapPin, Package } from "lucide-react";

// Import tab components
import { DetailsTab } from "./tabs/DetailsTab";
import { LocationsTab } from "./tabs/LocationsTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { AssignmentTab } from "./tabs/AssignmentTab";
import { CompletionReviewTab } from "./tabs/CompletionReviewTab";
import { ClipboardCheck, ArrowLeft, ArrowRight } from "lucide-react";

const tabClassName =
  "flex-1 rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/10 transition-colors text-sm md:text-base py-2.5";
interface BookingFormProps {
  initialData?: Booking;
  onSubmit: (values: BookingFormData) => void;
  isLoading?: boolean;
  initialTab?: string;
}

export function BookingForm({
  initialData,
  onSubmit,
  isLoading,
  initialTab = "details",
}: BookingFormProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

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
      scheduledDateTime: initialData?.scheduledDateTime || "",
      endTime: initialData?.endTime || "",
      pickupLocation: {
        addressLine1:
          initialData?.pickupLocation?.addressLine1 ||
          (!initialData ? "Rkb house" : ""),
        addressLine2: initialData?.pickupLocation?.addressLine2 || "",
        city:
          initialData?.pickupLocation?.city ||
          (!initialData ? "Gravesend" : ""),
        county:
          initialData?.pickupLocation?.county || (!initialData ? "kent" : ""),
        postcode:
          initialData?.pickupLocation?.postcode ||
          (!initialData ? "DA12 2RU" : ""),
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
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(BookingSchema),
    onSubmit: (values) => {
      const sanitized = {
        ...values,
        assignedDriverId: values.assignedDriverId || null,
        vehicleId: values.vehicleId || null,
      };
      // @ts-ignore Let Formik pass sanitized values.
      onSubmit(sanitized);
    },
  });

  useEffect(() => {
    if (!initialData) {
      if (!formik.values.scheduledDateTime) {
        formik.setFieldValue("scheduledDateTime", dayjs().toISOString());
      }
      if (!formik.values.endTime) {
        formik.setFieldValue("endTime", dayjs().add(2.5, "hour").toISOString());
      }
    }
  }, [initialData]);

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

  const scheduledDate = formik.values.scheduledDateTime
    ? new Date(formik.values.scheduledDateTime).getTime()
    : 0;
  const now = new Date().getTime();
  const timeDiffHours = scheduledDate
    ? (scheduledDate - now) / (1000 * 60 * 60)
    : 0;
  const isWithin24Hours = scheduledDate ? timeDiffHours <= 24 : false;

  const TABS = ["details", "locations", "products"];
  if (isWithin24Hours) {
    TABS.push("driver");
  }

  if (
    initialData?.status === BookingStatus.JOB_SUBMITTED ||
    initialData?.status === BookingStatus.JOB_REJECTED ||
    initialData?.status === BookingStatus.COMPLETED
  ) {
    TABS.push("review");
  }

  const currentIndex = TABS.indexOf(activeTab);

  const handleNext = () => {
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1]);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-6 py-2 rounded-2xl border border-slate-200 shadow-sm mb-2!">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {initialData ? "Edit Booking" : "Create New Booking"}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Setup job details, locations, and pricing.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push(ROUTES_PATH.BOOKINGS.BASE)}
          variant="outline"
          className="rounded-xl px-6 h-11 font-bold">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        style={{ marginTop: "2px" }}>
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide mb-2!">
          <TabsList
            className={`flex min-w-max w-full h-16 p-1.5 bg-slate-100 rounded-2xl pointer-events-none`}>
            <TabsTrigger value="details" className={tabClassName}>
              <Calendar className="h-4 w-4 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger value="locations" className={tabClassName}>
              <MapPin className="h-4 w-4 mr-2" /> Locations
            </TabsTrigger>
            <TabsTrigger value="products" className={tabClassName}>
              <Package className="h-4 w-4 mr-2" /> Products
            </TabsTrigger>
            {TABS.includes("driver") && (
              <TabsTrigger value="driver" className={tabClassName}>
                <Car className="h-4 w-4 mr-2" /> Assignment
              </TabsTrigger>
            )}
            {(initialData?.status === BookingStatus.JOB_SUBMITTED ||
              initialData?.status === BookingStatus.JOB_REJECTED ||
              initialData?.status === BookingStatus.COMPLETED) && (
              <TabsTrigger value="review" className={tabClassName}>
                <ClipboardCheck className="h-4 w-4 mr-2" /> Review
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <div className="flex justify-between items-center bg-white p-6 py-3 rounded-2xl border-2 border-slate-100 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className={`rounded-xl px-6 h-11 font-bold text-primary hover:text-primary/90 hover:bg-primary/10 transition-colors ${currentIndex === 0 ? "invisible" : ""}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="flex gap-4 items-center">
            {activeTab !== "review" && (
              <Button
                type="button"
                onClick={handleConfirmClick}
                disabled={isLoading}
                className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                {isLoading
                  ? "Saving..."
                  : initialData
                    ? "Save"
                    : "Create Booking"}
              </Button>
            )}

            {currentIndex < TABS.length - 1 && (
              <Button
                type="button"
                onClick={handleNext}
                className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {activeTab === "details" && (
              <DetailsTab
                formik={formik}
                initialClient={initialData?.clientId}
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
            {activeTab === "driver" && TABS.includes("driver") && (
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
