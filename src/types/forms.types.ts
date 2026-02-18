import { z } from "zod";
import {
  BookingSchema,
  CompanySchema,
  CustomerSchema,
  DriverSchema,
  LoginSchema,
  ProductSchema,
} from "../schemas/validationSchemas";
import { loginSchema } from "../schemas/auth.schema";

export type CompanyFormData = z.infer<typeof CompanySchema>;
export type CustomerFormData = z.infer<typeof CustomerSchema>;
export type ProductFormData = z.infer<typeof ProductSchema>;
export type DriverFormData = z.infer<typeof DriverSchema>;
export type BookingFormData = z.infer<typeof BookingSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
