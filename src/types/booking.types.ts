import { BookingStatus, ServiceType } from "../enums/booking.enum";

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface IBookingProduct {
  productId: string | { _id: string };
  name: string;
  quantity: number;
  rate: number; // basePrice from product
  baseCharge?: number;
  hourlyRate?: number;
  extraCharges?: { label: string; amount: number }[];
}

export interface IWaitingTime {
  durationMinutes?: number;
  reason?: string;
  reasonNotes?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  companyId: string | { _id: string; name: string };
  clientId: {
    _id: string;
    legalDetails: { legalName: string };
  };
  serviceType: ServiceType;
  pickupLocation: IAddress;
  dropLocation: IAddress;
  scheduledDateTime: string;
  assignedDriverId?:
    | string
    | { _id: string; fullName: string; mobileNumber: string };
  vehicleId?:
    | string
    | { _id: string; vehicleName: string; vehicleNumber: string };
  products: IBookingProduct[];
  jobDetails?: string;
  status: BookingStatus;
  startTime?: string;
  endTime?: string;
  jobPhotos: string[];
  driverNotes?: string;
  waitingTime?: IWaitingTime;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  companyId: string;
  clientId: string;
  serviceType: ServiceType;
  pickupLocation: IAddress;
  dropLocation: IAddress;
  scheduledDateTime: string;
  assignedDriverId?: string;
  vehicleId?: string;
  products: IBookingProduct[];
  jobDetails?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  clientId?: string;
  assignedDriverId?: string;
  status?: BookingStatus;
  search?: string;
}

export interface BookingResponse {
  data: {
    booking: Booking;
  };
  message: string;
  success: boolean;
}

export interface BookingsResponse {
  data: {
    bookings: Booking[];
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
