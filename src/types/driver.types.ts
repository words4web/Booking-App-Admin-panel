export interface DocumentType {
  key: string | null;
  url?: string | null;
  isVerified: boolean;
  reason?: string | null;
}

export interface LicenseBundle {
  frontImage: DocumentType;
  backImage: DocumentType;
}

export interface ExtraDocs {
  tachographCard?: LicenseBundle;
  cpcCard?: LicenseBundle;
  mpqcSafety?: {
    cardFront: DocumentType;
    cardBack: DocumentType;
    certificate: DocumentType;
  };
  cscsCard?: LicenseBundle;
  companyId?: LicenseBundle;
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
  license: LicenseBundle;
  passport: {
    passportImage: DocumentType;
  };
  extraDocs?: ExtraDocs;
  isDeleted?: boolean;
  isDeletedByUser?: boolean;
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

export interface DeletedDriversResponse {
  drivers: Driver[];
}

export interface ReviewDeletionResponse {
  success: boolean;
  message: string;
}
