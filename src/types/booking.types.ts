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
  waitingRate?: number;
  waitingTimeUnit?: string;
  extraCharges?: { label: string; amount: number }[];
}

export interface IWaitingTime {
  durationMinutes?: number;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface IJobPhoto {
  key: string;
  url: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  companyId:
    | string
    | {
        _id: string;
        name: string;
        address?: IAddress;
        vatNumber?: string;
        registrationNumber?: string;
        telephone?: string;
        adminEmail?: string;
        invoicePrefix?: string;
        bankName?: string;
        bankCode?: string;
        bankAccountNumber?: string;
      };
  clientId: {
    _id: string;
    contactInfo?: {
      firstName?: string;
      lastName?: string;
      email: string;
      phone: string;
    };
    legalDetails: { legalName: string };
    address?: IAddress;
    vatExempt?: boolean;
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
  jobPhotos: IJobPhoto[];
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
  endTime?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  clientId?: string;
  assignedDriverId?: string;
  status?: BookingStatus;
  search?: string;
  getAll?: boolean;
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

export interface CalendarBooking {
  _id: string;
  bookingId: string;
  scheduledDateTime: string;
  status: BookingStatus;
  serviceType: ServiceType;
  clientName: string;
}

export interface CalendarResponse {
  data: { bookings: CalendarBooking[] };
  success: boolean;
  message: string;
}
