import { UnitType } from "../enums/product.enum";

export interface IExtraCharge {
  label: string;
  amount: number;
}

export interface Product {
  _id: string;
  companyId: string | { _id: string; name: string };
  name: string;
  description: string;
  unitType: UnitType;
  basePrice: number;
  baseCharge: number;
  hourlyRate: number;
  extraCharges: IExtraCharge[];
  vatApplicable: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  companyId?: string;
  name: string;
  description: string;
  unitType: UnitType;
  basePrice: number;
  baseCharge: number;
  hourlyRate: number;
  extraCharges: IExtraCharge[];
  vatApplicable: boolean;
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
