export interface DocumentType {
  key: string | null;
  url?: string | null;
  isVerified: boolean;
  reason?: string | null;
}

export interface Driver {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profileImage?: string | null;
  isDocumentsVerified: boolean;
  isOtpVerified: boolean;
  nationalInsuranceNumber: string;
  license: {
    frontImage: DocumentType;
    backImage: DocumentType;
  };
  passport: {
    passportImage: DocumentType;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AllDriversResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DriverDetailsResponse {
  driver: Driver;
}

export interface VerifyDocumentResponse {
  success: boolean;
  message: string;
}
