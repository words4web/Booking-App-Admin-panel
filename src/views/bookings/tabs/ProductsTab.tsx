"use client";
import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Product } from "@/src/types/product.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Package, Trash2, Check, ChevronsUpDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductsTabProps {
  formik: FormikProps<BookingFormData>;
  products: Product[];
  addProduct: (productId: string) => void;
  removeProduct: (index: number) => void;
  getFieldError: (name: string) => string | null;
}

export function ProductsTab({
  formik,
  products,
  addProduct,
  removeProduct,
  getFieldError,
}: ProductsTabProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-0 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">
            Job Items & Pricing
          </h3>
          <p className="text-sm text-slate-500">
            Search and select products to add them to this job.
          </p>
        </div>

        <div className="w-full md:w-[600px]">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Search & Select Product
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full h-12 justify-between rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white transition-all shadow-sm text-slate-700 font-bold">
                Search for a product...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-slate-200 shadow-xl rounded-xl overflow-hidden z-[100]">
              <Command className="w-full">
                <CommandInput
                  placeholder="Type to search products..."
                  className="h-12"
                />
                <CommandList className="max-h-[300px] border border-slate-100 rounded-b-xl">
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    {products?.map((p) => (
                      <CommandItem
                        key={p?._id}
                        value={p?.name}
                        onSelect={() => {
                          addProduct(p?._id);
                          setOpen(false);
                        }}
                        // disabled={
                        //   formik.values.companyId !==
                        //   (typeof p.companyId === "string"
                        //     ? p.companyId
                        //     : p.companyId?._id)
                        // }
                        className={cn(
                          "py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors",
                          // formik.values.companyId !==
                          //   (typeof p.companyId === "string"
                          //     ? p.companyId
                          //     : p.companyId?._id) && "hidden",
                        )}>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">
                            {p?.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Base Price: £{p?.basePrice}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary",
                            formik.values.products.some(
                              (sp) => sp.productId === p._id,
                            )
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        {formik.values.products?.map((product, index) => (
          <div
            key={index}
            className="group relative bg-slate-50/30 hover:bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-end">
              <div className="col-span-2 md:col-span-4 space-y-1.5 mb-2 sm:mb-0">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Item Name
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(index)}
                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  disabled
                  {...formik.getFieldProps(`products.${index}.name`)}
                  className="h-12 sm:h-14 text-base sm:text-lg rounded-xl border-slate-200 bg-white shadow-sm font-bold"
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Qty
                </Label>
                <Input
                  min={1}
                  type="number"
                  step="any"
                  {...formik.getFieldProps(`products.${index}.quantity`)}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue(
                      `products.${index}.quantity`,
                      val === "" ? "" : Number(val),
                    );
                  }}
                  className={cn(
                    "h-12 sm:h-14 text-sm sm:text-md rounded-xl border-slate-200 bg-white text-center font-bold",
                    getFieldError(`products.${index}.quantity`) &&
                      "border-destructive",
                  )}
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Base Price (£)
                </Label>
                <Input
                  min={0}
                  type="number"
                  step="any"
                  {...formik.getFieldProps(`products.${index}.rate`)}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue(
                      `products.${index}.rate`,
                      val === "" ? "" : Number(val),
                    );
                  }}
                  className={cn(
                    "h-12 sm:h-14 text-sm sm:text-md rounded-xl border-slate-200 bg-white font-medium",
                    getFieldError(`products.${index}.rate`) &&
                      "border-destructive",
                  )}
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Base Chg (£)
                </Label>
                <Input
                  min={0}
                  type="number"
                  step="any"
                  {...formik.getFieldProps(`products.${index}.baseCharge`)}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue(
                      `products.${index}.baseCharge`,
                      val === "" ? "" : Number(val),
                    );
                  }}
                  className="h-12 sm:h-14 text-sm sm:text-md rounded-xl border-slate-200 bg-white font-medium"
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Hourly Rate (£)
                </Label>
                <Input
                  min={0}
                  type="number"
                  step="any"
                  {...formik.getFieldProps(`products.${index}.hourlyRate`)}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue(
                      `products.${index}.hourlyRate`,
                      val === "" ? "" : Number(val),
                    );
                  }}
                  className="h-12 sm:h-14 text-sm sm:text-md rounded-xl border-slate-200 bg-white font-medium"
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pt-4 sm:pt-6 border-t border-dashed border-slate-200">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Waiting Time Policy
                </p>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700">
                    {/* £{product.waitingRate || 0} per{" "}
                    {product.waitingTimeUnit || "N/A"} */}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    This rate will be applied for any waiting duration.
                  </p>
                </div>
              </div>
              {product?.extraCharges && product?.extraCharges?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package className="h-3 w-3" /> Additional Charges
                  </p>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-wrap gap-2">
                    {product?.extraCharges?.map((charge, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
                        {charge?.label}: £{charge?.amount}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {formik.values.products?.length === 0 && (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed bg-slate-50/30",
              getFieldError("products")
                ? "border-destructive bg-destructive/5"
                : "border-slate-200",
            )}>
            <Package
              className={cn(
                "h-12 w-12 mb-4",
                getFieldError("products")
                  ? "text-destructive"
                  : "text-slate-300",
              )}
            />
            <p
              className={cn(
                "font-bold",
                getFieldError("products")
                  ? "text-destructive"
                  : "text-slate-500",
              )}>
              {getFieldError("products") || "No products added yet"}
            </p>
            <p className="text-slate-400 text-sm">
              Search and select a product above to start pricing this job.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
