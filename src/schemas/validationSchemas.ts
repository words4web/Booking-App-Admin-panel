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

export const OptionalAddressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default("United Kingdom"),
});

// ─── Company ──────────────────────────────────────────────────────────────────
export const CompanySchema = z
  .object({
    name: z.string().min(1, "Company name is required").max(255),
    registrationNumber: z.string().min(1, "Registration number is required"),
    vatNumber: z.string().optional(),
    vatRegistered: z.boolean().default(false),
    invoicePrefix: z.string().min(1, "Invoice prefix is required"),
    bankAccountNumber: z.string().optional(),
    bankCode: z.string().optional(),
    bankName: z.string().optional(),
    adminEmail: z.string().email("Valid email is required"),
  })
  .superRefine((data, ctx) => {
    if (data.vatRegistered && !data.vatNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "VAT number is required",
        path: ["vatNumber"],
      });
    }
  });

// ─── Client ───────────────────────────────────────────────────────────────────
export const getClientSchema = (isSuperAdmin: boolean) =>
  z.object({
    contactInfo: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone number is required"),
    }),
    legalDetails: z.object({
      legalName: z.string().min(1, "Legal name is required"),
      registrationNumber: z.string().min(1, "Registration number is required"),
      vatRegistered: z.boolean().default(false),
      vatNumber: z.string().optional(),
      purchaseOrderNumber: z.string().optional(),
      // nationalInsuranceNumber: z.string().optional(),
    }),
    address: AddressSchema,
    vatExempt: z.boolean().default(true),
    companyId: isSuperAdmin
      ? z.string().min(1, "Company selection is required")
      : z.string().optional(),
  });

export const ClientSchema = getClientSchema(false);

// ─── Product ──────────────────────────────────────────────────────────────────
export const ExtraChargeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
});

export const ProductSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().min(1, "Description is required"),
  unitType: z.nativeEnum(UnitType, { required_error: "Unit type is required" }),
  basePrice: z.coerce.number().min(0, "Base price cannot be negative"),
  baseCharge: z.coerce.number().min(0).default(0),
  hourlyRate: z.coerce.number().min(0).default(0),
  extraCharges: z.array(ExtraChargeSchema).default([]),
  vatApplicable: z.boolean().default(true),
});

// ─── Booking ──────────────────────────────────────────────────────────────────
export const BookingProductSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate cannot be negative"), // This is basePrice
  baseCharge: z.coerce.number().min(0).optional(),
  hourlyRate: z.coerce.number().min(0).optional(),
  waitingRate: z.coerce.number().min(0).optional(),
  waitingTimeUnit: z.string().optional(),
  extraCharges: z.array(ExtraChargeSchema).optional(),
});

export const BookingSchema = z
  .object({
    companyId: z.string().min(1, "Company selection is required"),
    clientId: z.string().min(1, "Client selection is required"),
    serviceType: z.nativeEnum(ServiceType, {
      required_error: "Service type is required",
    }),
    pickupLocation: AddressSchema,
    dropLocation: OptionalAddressSchema,
    scheduledDateTime: z.string().min(1, "Scheduled date and time is required"),
    assignedDriverId: z.string().min(1, "Driver assignment is required"),
    vehicleId: z.string().min(1, "Vehicle assignment is required"),
    products: z
      .array(BookingProductSchema)
      .min(1, "At least one product is required"),
    jobDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType !== ServiceType.HAULAGE) {
      if (!data.dropLocation.addressLine1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address Line 1 is required",
          path: ["dropLocation", "addressLine1"],
        });
      }
      if (!data.dropLocation.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["dropLocation", "city"],
        });
      }
      if (!data.dropLocation.postcode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Postcode is required",
          path: ["dropLocation", "postcode"],
        });
      }
    }
  });

// ─── Invoice ──────────────────────────────────────────────────────────────────
export const InvoiceLineSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0).default(1),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
  vatPercent: z.coerce.number().min(0).max(100).default(20),
});

export const InvoiceSchema = z
  .object({
    companyId: z.string().optional(),
    clientId: z.string().min(1, "Client is required"),
    bookingId: z.string().min(1, "Booking reference is required"),
    invoiceDate: z.string().optional(),
    dueDate: z.string().optional(),
    transactionType: z
      .nativeEnum(TransactionType)
      .default(TransactionType.SALES),
    lineItems: z
      .array(InvoiceLineSchema)
      .min(1, "At least one line item is required"),
    billingName: z.string().optional(),
    billingAddress: z.string().optional(),
    companyAddress: z.string().optional(),
    waitingMinutes: z.coerce.number().optional(),
    waitingTotal: z.coerce.number().optional(),
    isNightShift: z.boolean().optional(),
    nightShiftAmount: z.coerce.number().optional(),
    extraCharges: z
      .array(
        z.object({
          label: z.string().min(1, "Charge label is required"),
          amount: z.coerce.number().min(0, "Amount cannot be negative"),
        }),
      )
      .optional(),
    notes: z.string().optional(),
    paymentLink: z.string().optional(),
    terms: z.string().optional(),
    logoFile: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.dueDate) return true;
      const invDate = new Date(data.invoiceDate || new Date());
      const dDate = new Date(data.dueDate);
      return dDate >= invDate;
    },
    {
      message: "Due date cannot be before the invoice date",
      path: ["dueDate"],
    },
  );

// ─── Other ────────────────────────────────────────────────────────────────────
export const DriverSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
});

// ─── CMS ──────────────────────────────────────────────────────────────────────
export const CMSSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Page title is required"),
  content: z.string().min(1, "Page content is required"),
});
