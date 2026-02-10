'use client'
import { useState } from "react";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductForm() {
  const router = useRouter();
  const [unitType, setUnitType] = useState("trip");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/products");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          New Product/Service
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Define a new product or service offering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Standard Delivery" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Door to door delivery service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type</Label>
              <select
                id="unitType"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required>
                <option value="trip">Trip</option>
                <option value="hour">Hour</option>
                <option value="load">Load</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Unit Price (£)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vatApplicable"
                  className="rounded"
                  defaultChecked
                />
                <Label htmlFor="vatApplicable" className="font-normal">
                  VAT Applicable (20%)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waitingTimeApplicable"
                  className="rounded"
                />
                <Label htmlFor="waitingTimeApplicable" className="font-normal">
                  Waiting Time Applicable
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}>
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
