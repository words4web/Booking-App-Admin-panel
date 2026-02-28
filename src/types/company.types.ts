export interface Company {
  _id: string;
  name: string;
  registrationNumber: string;
  vatNumber: string;
  vatRegistered: boolean;
  invoicePrefix: string;
  invoiceCounter: number;
  bankAccountNumber?: string;
  bankCode?: string;
  bankName?: string;
  adminEmail: string;
  adminUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllCompaniesResponse {
  companies: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CompanyDetailsResponse {
  company: Company;
}
