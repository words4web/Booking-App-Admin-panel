"use client";

import { FormikProps } from "formik";
import { BookingFormData } from "@/src/types/booking.types";
import { Product } from "@/src/types/product.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Package, Plus, Trash2 } from "lucide-react";

interface ProductsTabProps {
  formik: FormikProps<BookingFormData>;
  products: Product[];
  addProduct: (productId: string) => void;
  removeProduct: (index: number) => void;
}

export function ProductsTab({
  formik,
  products,
  addProduct,
  removeProduct,
}: ProductsTabProps) {
  return (
    <div className="mt-0 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Job Items & Pricing
          </h3>
          <p className="text-sm text-slate-500">
            Add services and override default rates if needed.
          </p>
        </div>
        <div className="w-72">
          <Select onValueChange={addProduct}>
            <SelectTrigger className="h-11 rounded-xl border-primary/20 bg-primary/5 text-primary font-bold">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </SelectTrigger>
            <SelectContent className="bg-white">
              {products?.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {formik.values.products?.map((_, index) => (
          <div
            key={index}
            className="group relative bg-slate-50/50 hover:bg-white border border-slate-200 p-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-slate-200/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Item Name / Description
                </Label>
                <Input
                  {...formik.getFieldProps(`products.${index}.name`)}
                  className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm font-bold"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Qty
                </Label>
                <Input
                  type="number"
                  {...formik.getFieldProps(`products.${index}.quantity`)}
                  className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Base Chg (£)
                </Label>
                <Input
                  type="number"
                  {...formik.getFieldProps(`products.${index}.baseCharge`)}
                  className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Hourly (£)
                </Label>
                <Input
                  type="number"
                  {...formik.getFieldProps(`products.${index}.hourlyRate`)}
                  className="h-11 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-sm"
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
            <p className="text-slate-400 text-sm">
              Select a product above to start pricing this job.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
