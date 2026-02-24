export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  companyId: string | { _id: string; name: string };
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  basePrice: number;
  companyId?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  search?: string;
}

export interface ProductResponse {
  data: {
    product: Product;
  };
  message: string;
  success: boolean;
}

export interface ProductsResponse {
  data: {
    products: Product[];
    pagination: {
      limit: number;
      page: number;
      pages: number;
      total: number;
    };
  };
  message: string;
  success: boolean;
}
