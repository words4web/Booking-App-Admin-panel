import { z } from "zod";

export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  registrationNumber: z.string().min(1, "Registration number is required"),
  vatNumber: z.string().min(1, "VAT number is required"),
  vatRegistered: z.boolean().default(true),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  bankAccountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  adminEmail: z.string().email("Valid email is required"),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required").max(255),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  vatExempt: z.boolean().default(false),
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
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
});

export const BookingSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
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
