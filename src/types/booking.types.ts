import {
  BookingStatus,
  ServiceType,
  WaitingTimeStatus,
  WaitingTimeUnit,
} from "../enums/booking.enum";

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
  rate: number;
  baseCharge?: number;
  hourlyRate?: number;
}

export interface IWaitingTime {
  durationMinutes?: number;
  waitingTimeRate?: number;
  waitingTimeUnit?: WaitingTimeUnit;
  reason?: string;
  reasonNotes?: string;
  status?: WaitingTimeStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  companyId: string | { _id: string; name: string };
  clientId:
    | string
    | {
        _id: string;
        contactInfo: { firstName: string; lastName: string };
        legalDetails: { legalName: string };
      };
  serviceType: ServiceType;
  pickupLocation: IAddress;
  dropLocation: IAddress;
  scheduledDateTime: string;
  assignedDriverId?:
    | string
    | { _id: string; firstName: string; lastName: string };
  vehicleId?:
    | string
    | { _id: string; vehicleName: string; vehicleNumber: string };
  vehicleType?: string;
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
  companyId?: string;
  clientId: string;
  serviceType: ServiceType;
  pickupLocation: IAddress;
  dropLocation: IAddress;
  scheduledDateTime: string;
  assignedDriverId?: string;
  vehicleId?: string;
  vehicleType?: string;
  products: IBookingProduct[];
  jobDetails?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  clientId?: string;
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
