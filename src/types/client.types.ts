export interface Client {
  _id: string;
  companyId:
    | {
        _id: string;
        name: string;
        registrationNumber: string;
        vatNumber: string;
      }
    | string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  legalDetails: {
    legalName: string;
    registrationNumber: string;
    vatNumber?: string;
    vatRegistered: boolean;
    purchaseOrderNumber?: string;
    nationalInsuranceNumber?: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  companyId?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  legalDetails: {
    legalName: string;
    registrationNumber: string;
    vatNumber: string;
    vatRegistered: boolean;
    purchaseOrderNumber: string;
    nationalInsuranceNumber: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface ClientFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  search?: string;
}

export interface ClientResponse {
  data: {
    client: Client;
  };
  message: string;
  success: boolean;
}

export interface ClientsResponse {
  data: {
    clients: Client[];
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
