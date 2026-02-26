"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { BookingSchema } from "@/src/schemas/validationSchemas";
import { BookingFormData, IBookingProduct } from "@/src/types/booking.types";
import { ServiceType } from "@/src/enums/booking.enum";
import { useAllClientsQuery } from "@/src/services/clientManager/useClientQueries";
import { useAllProductsQuery } from "@/src/services/productManager/useProductQueries";
import { useAllDriversQuery } from "@/src/services/driverManager/useDriverQueries";
import { useVehiclesQuery } from "@/src/services/vehicleManager/useVehicleQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, MapPin, Calendar, Package, Truck, User, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingFormProps {
  initialData?: any;
  onSubmit: (values: BookingFormData) => void;
  isLoading?: boolean;
}

export function BookingForm({ initialData, onSubmit, isLoading }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");

  const { data: clientsData, isLoading: isLoadingClients } = useAllClientsQuery();
  const { data: productsData, isLoading: isLoadingProducts } = useAllProductsQuery();
  const { data: driversData, isLoading: isLoadingDrivers } = useAllDriversQuery(1, 100);
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehiclesQuery();

  const clients = clientsData?.clients || [];
  const products = productsData?.products || [];
  const drivers = driversData || [];
  const vehicles = vehiclesData?.vehicles || [];

  const formik = useFormik<BookingFormData>({
    initialValues: {
      clientId: initialData?.clientId?._id || initialData?.clientId || "",
      serviceType: initialData?.serviceType || ServiceType.RMC,
      scheduledDateTime: initialData?.scheduledDateTime ? new Date(initialData.scheduledDateTime).toISOString().slice(0, 16) : "",
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
      products: initialData?.products?.map((p: any) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        quantity: p.quantity,
        rate: p.rate,
        baseCharge: p.baseCharge,
        hourlyRate: p.hourlyRate,
      })) || [],
      assignedDriverId: initialData?.assignedDriverId?._id || initialData?.assignedDriverId || "",
      vehicleId: initialData?.vehicleId?._id || initialData?.vehicleId || "",
      vehicleType: initialData?.vehicleType || "",
      jobDetails: initialData?.jobDetails || "",
    },
    validationSchema: toFormikValidationSchema(BookingSchema),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getFieldError = (name: string) => {
    const error = formik.errors as any;
    const touched = formik.touched as any;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      return touched[parts[0]]?.[parts[1]] ? error[parts[0]]?.[parts[1]] : null;
    }
    return touched[name] ? error[name] : null;
  };

  const addProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const newProduct: IBookingProduct = {
      productId: product._id,
      name: product.name,
      quantity: 1,
      rate: product.basePrice,
      baseCharge: product.baseCharge,
      hourlyRate: product.hourlyRate,
    };

    formik.setFieldValue("products", [...formik.values.products, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newProducts = [...formik.values.products];
    newProducts.splice(index, 1);
    formik.setFieldValue("products", newProducts);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {initialData ? "Edit Booking" : "Create New Booking"}
          </h1>
          <p className="text-sm text-slate-500 font-medium">Setup job details, locations, and pricing.</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="rounded-xl px-6 h-11 font-bold">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20">
            {isLoading ? "Saving..." : initialData ? "Update Booking" : "Confirm Booking"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-slate-100 rounded-2xl mb-8">
          <TabsTrigger value="details" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4 mr-2" /> Details
          </TabsTrigger>
          <TabsTrigger value="locations" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MapPin className="h-4 w-4 mr-2" /> Locations
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Package className="h-4 w-4 mr-2" /> Products
          </TabsTrigger>
          <TabsTrigger value="driver" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Truck className="h-4 w-4 mr-2" /> Assignment
          </TabsTrigger>
        </TabsList>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* ─── DETAILS TAB ─────────────────────────────────────────── */}
            <TabsContent value="details" className="mt-0 space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Client</Label>
                  <Select
                    onValueChange={(val) => formik.setFieldValue("clientId", val)}
                    value={formik.values.clientId}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {clients.map((client: any) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.legalDetails.legalName} ({client.contactInfo.firstName} {client.contactInfo.lastName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("clientId") && <p className="text-xs text-destructive font-medium">{getFieldError("clientId")}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Service Type</Label>
                  <Select
                    onValueChange={(val) => formik.setFieldValue("serviceType", val)}
                    value={formik.values.serviceType}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.values(ServiceType).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Scheduled Date & Time</Label>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      {...formik.getFieldProps("scheduledDateTime")}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-10"
                    />
                    <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                  {getFieldError("scheduledDateTime") && <p className="text-xs text-destructive font-medium">{getFieldError("scheduledDateTime")}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Job Details / Instructions</Label>
                <Textarea
                  placeholder="Enter specific instructions for the driver..."
                  className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4"
                  {...formik.getFieldProps("jobDetails")}
                />
              </div>
            </TabsContent>

            {/* ─── LOCATIONS TAB ───────────────────────────────────────── */}
            <TabsContent value="locations" className="mt-0 space-y-12 animate-in fade-in duration-500">
              {/* Pickup Address */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 text-xs">A</span>
                  Pickup Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Address Line 1</Label>
                    <Input {...formik.getFieldProps("pickupLocation.addressLine1")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">City</Label>
                    <Input {...formik.getFieldProps("pickupLocation.city")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Postcode</Label>
                    <Input {...formik.getFieldProps("pickupLocation.postcode")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                </div>
              </div>

              {/* Drop-off Address */}
              <div className="space-y-6 pt-12 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs">B</span>
                  Drop-off Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Address Line 1</Label>
                    <Input {...formik.getFieldProps("dropLocation.addressLine1")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">City</Label>
                    <Input {...formik.getFieldProps("dropLocation.city")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Postcode</Label>
                    <Input {...formik.getFieldProps("dropLocation.postcode")} className="h-11 rounded-lg border-slate-200" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ─── PRODUCTS TAB ────────────────────────────────────────── */}
            <TabsContent value="products" className="mt-0 space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Job Items & Pricing</h3>
                  <p className="text-sm text-slate-500">Add services and override default rates if needed.</p>
                </div>
                <div className="w-72">
                  <Select onValueChange={addProduct}>
                    <SelectTrigger className="h-11 rounded-xl border-primary/20 bg-primary/5 text-primary font-bold">
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {formik.values.products.map((p, index) => (
                  <div key={index} className="group relative bg-slate-50/50 hover:bg-white border border-slate-200 p-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                      <div className="md:col-span-4 space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Item Name</Label>
                        <p className="font-bold text-slate-900 truncate">{p.name}</p>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Qty</Label>
                        <Input
                          type="number"
                          {...formik.getFieldProps(`products.${index}.quantity`)}
                          className="h-11 rounded-xl border-slate-200 bg-white"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Base Chg (£)</Label>
                        <Input
                          type="number"
                          {...formik.getFieldProps(`products.${index}.baseCharge`)}
                          className="h-11 rounded-xl border-slate-200 bg-white"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Hourly (£)</Label>
                        <Input
                          type="number"
                          {...formik.getFieldProps(`products.${index}.hourlyRate`)}
                          className="h-11 rounded-xl border-slate-200 bg-white"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(index)}
                          className="h-11 w-11 rounded-xl text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {formik.values.products.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30">
                    <Package className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No products added yet</p>
                    <p className="text-slate-400 text-sm">Select a product above to start pricing this job.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ─── ASSIGNMENT TAB ──────────────────────────────────────── */}
            <TabsContent value="driver" className="mt-0 space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Assign Driver (Optional)</Label>
                  <Select
                    onValueChange={(val) => formik.setFieldValue("assignedDriverId", val)}
                    value={formik.values.assignedDriverId}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="">Unassigned</SelectItem>
                      {drivers.map((driver: any) => (
                        <SelectItem key={driver._id} value={driver._id}>
                          {driver.firstName} {driver.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Assign Vehicle (Optional)</Label>
                  <Select
                    onValueChange={(val) => formik.setFieldValue("vehicleId", val)}
                    value={formik.values.vehicleId}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                      <SelectValue placeholder="No Vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="">No Vehicle</SelectItem>
                      {vehicles.map((vehicle: any) => (
                        <SelectItem key={vehicle._id} value={vehicle._id}>
                          {vehicle.vehicleName} ({vehicle.vehicleNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Vehicle Type Preference</Label>
                  <Input
                    placeholder="e.g. 8 Wheeler, Grab"
                    {...formik.getFieldProps("vehicleType")}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </form>
  );
}
