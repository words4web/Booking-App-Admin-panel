export interface DocumentType {
  url: string;
  isVerified: boolean;
  reason?: string;
}

export interface Driver {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profileImage?: string;
  isDocumentsVerified: boolean;
  isOtpVerified: boolean;
  license?: {
    frontImage?: DocumentType;
    backImage?: DocumentType;
  };
  passport?: {
    bioDataPage?: DocumentType;
    signaturePage?: DocumentType;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AllDriversResponse {
  drivers: Driver[];
  total: number;
}

export interface DriverDetailsResponse {
  driver: Driver;
}

export interface VerifyDocumentResponse {
  success: boolean;
  message: string;
}
