"use client";

import { useParams, useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";
import { ProductForm } from "@/src/views/products/ProductForm";
import {
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "@/src/services/productManager/useProductQueries";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ProductFormData } from "@/src/types/product.types";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading } = useProductDetailsQuery(productId);
  const updateMutation = useUpdateProductMutation(productId);

  const handleSubmit = (data: ProductFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES_PATH.PRODUCTS.BASE);
      },
    });
  };

  if (isLoading) {
    return <CommonLoader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <p className="text-slate-500">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <ProductForm
        mode="edit"
        initialData={product}
        onSubmit={handleSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
