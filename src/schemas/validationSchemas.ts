import { z } from "zod";

// UK Validation Patterns
// const UK_PHONE_REGEX =
//   /^(?:(?:\+44\s?|0)7(?:\d\s?){9}|(?:\+44\s?|0)(?:(?:\d\s?){10}))$/;
// const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
// const UK_SORT_CODE_REGEX = /^\d{6}$|^\d{2}-\d{2}-\d{2}$/;

export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  registrationNumber: z.string().min(1, "Registration number is required"),
  vatNumber: z.string().min(1, "VAT number is required"),
  vatRegistered: z.boolean().default(true),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  bankAccountNumber: z.string().optional(),
  bankCode: z
    .string()
    // .refine(
    //   (val) => !val || UK_SORT_CODE_REGEX.test(val),
    //   "Invalid UK sort code",
    // )
    .optional(),
  adminEmail: z.string().email("Valid email is required"),
});

export const ClientSchema = z.object({
  contactInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    // .regex(UK_PHONE_REGEX, "Invalid UK phone number"),
  }),
  legalDetails: z.object({
    legalName: z.string().min(1, "Legal name is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    vatRegistered: z.boolean().default(false),
    vatNumber: z.string().optional(),
  }),
  address: z.object({
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    // .regex(UK_POSTCODE_REGEX, "Invalid UK postcode"),
    country: z.string().min(1, "Country is required"),
  }),
  companyId: z.string().optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().optional(),
  unitType: z.enum(["trip", "hour", "load"]),
  unitPrice: z.number().positive("Unit price must be positive"),
  vatApplicable: z.boolean().default(true),
  waitingTimeApplicable: z.boolean().default(false),
});

export const DriverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  // .regex(UK_PHONE_REGEX, "Invalid UK mobile number"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
});

export const BookingSchema = z.object({
  clientId: z.string().min(1, "Client selection is required"),
  driverId: z.string().min(1, "Driver selection is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  products: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
      }),
    )
    .min(1, "At least one product is required"),
  notes: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
});
