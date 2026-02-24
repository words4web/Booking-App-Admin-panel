"use client";

import { ProductForm } from "@/src/views/products/ProductForm";
import { useCreateProductMutation } from "@/src/services/productManager/useProductQueries";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/src/types/product.types";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProductMutation();

  const handleSubmit = (data: ProductFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/products");
      },
    });
  };

  return (
    <div className="py-8">
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
