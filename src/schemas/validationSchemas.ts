import { z } from "zod";
import { UnitType } from "@/src/enums/product.enum";
import { ServiceType } from "@/src/enums/booking.enum";
import { TransactionType } from "@/src/enums/invoice.enum";

// ─── UK Address Schema (shared) ───────────────────────────────────────────────
export const AddressSchema = z.object({
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().default("United Kingdom"),
});

// ─── Company ──────────────────────────────────────────────────────────────────
export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  registrationNumber: z.string().min(1, "Registration number is required"),
  vatNumber: z.string().min(1, "VAT number is required"),
  vatRegistered: z.boolean().default(true),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  bankAccountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  adminEmail: z.string().email("Valid email is required"),
});

// ─── Client ───────────────────────────────────────────────────────────────────
export const ClientSchema = z.object({
  contactInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  legalDetails: z.object({
    legalName: z.string().min(1, "Legal name is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    vatRegistered: z.boolean().default(false),
    vatNumber: z.string().optional(),
    purchaseOrderNumber: z.string().optional(),
    nationalInsuranceNumber: z.string().optional(),
  }),
  address: AddressSchema,
  vatExempt: z.boolean().default(false),
  companyId: z.string().optional(),
});

// ─── Product ──────────────────────────────────────────────────────────────────
export const ExtraChargeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
});

export const ProductSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().min(1, "Description is required"),
  unitType: z.nativeEnum(UnitType, { required_error: "Unit type is required" }),
  basePrice: z.number().min(0, "Base price cannot be negative"),
  baseCharge: z.number().min(0).default(0),
  hourlyRate: z.number().min(0).default(0),
  waitingTimeRate: z.number().min(0).default(0),
  waitingTimeUnit: z.enum(["15min", "30min", "60min"]).default("30min"),
  extraCharges: z.array(ExtraChargeSchema).default([]),
  vatApplicable: z.boolean().default(true),
  defaultWaitingTimeApplicable: z.boolean().default(false),
});

// ─── Booking ──────────────────────────────────────────────────────────────────
export const BookingProductSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate cannot be negative"),
  baseCharge: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
});

export const BookingSchema = z.object({
  companyId: z.string().optional(),
  clientId: z.string().min(1, "Client selection is required"),
  serviceType: z.nativeEnum(ServiceType, {
    required_error: "Service type is required",
  }),
  pickupLocation: AddressSchema,
  dropLocation: AddressSchema,
  scheduledDateTime: z.string().min(1, "Scheduled date and time is required"),
  assignedDriverId: z.string().optional(),
  vehicleId: z.string().optional(),
  vehicleType: z.string().optional(),
  products: z
    .array(BookingProductSchema)
    .min(1, "At least one product is required"),
  jobDetails: z.string().optional(),
});

// ─── Invoice ──────────────────────────────────────────────────────────────────
export const InvoiceLineSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  account: z.string().default("Income"),
  quantity: z.number().min(0).default(1),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  vatPercent: z.number().min(0).max(100).default(20),
});

export const InvoiceSchema = z.object({
  companyId: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  bookingId: z.string().min(1, "Booking reference is required"),
  dueDate: z.string().optional(),
  transactionType: z.nativeEnum(TransactionType).default(TransactionType.SALES),
  lineItems: z
    .array(InvoiceLineSchema)
    .min(1, "At least one line item is required"),
  notes: z.string().optional(),
  paymentLink: z.string().optional(),
});

// ─── Other ────────────────────────────────────────────────────────────────────
export const DriverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
});
