import {
  InvoiceStatus,
  PaymentStatus,
  TransactionType,
} from "../enums/invoice.enum";

export interface IInvoiceLine {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  exVat: number;
  vatRateLabel: string;
  vatPercent: number;
  vatAmount: number;
  lineTotal: number;
}

export interface ITaxBreakdownRow {
  vatRateLabel: string;
  net: number;
  vat: number;
  inclVat: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  companyId:
    | string
    | {
        _id: string;
        name: string;
        vatNumber?: string;
        registrationNumber: string;
        bankName?: string;
        bankCode?: string;
        bankAccountNumber?: string;
        adminEmail?: string;
        telephone?: string;
        website?: string;
        address?: {
          addressLine1: string;
          addressLine2?: string;
          city: string;
          postcode: string;
          country: string;
        };
      };
  clientId:
    | string
    | {
        _id: string;
        contactInfo: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
        };
        legalDetails: { legalName: string };
        address: {
          addressLine1: string;
          city: string;
          postcode: string;
          country: string;
        };
      };
  bookingId: string | { _id: string; bookingId: string };
  invoiceDate: string;
  dueDate?: string;
  transactionType: TransactionType;
  lineItems: IInvoiceLine[];
  billingName?: string;
  billingAddress?: string;
  companyAddress?: string;
  waitingMinutes?: number;
  waitingTotal?: number;
  isNightShift?: boolean;
  nightShiftAmount?: number;
  logoFile?: string;
  subtotal: number;
  totalVat: number;
  totalAmount: number;
  taxBreakdown: ITaxBreakdownRow[];
  notes?: string;
  terms?: string;
  paymentLink?: string;
  paymentStatus: PaymentStatus;
  isPaid: boolean;
  paidAt?: string;
  sentAt?: string;
  status: InvoiceStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineFormData {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatPercent: number;
}

export interface InvoiceFormData {
  companyId?: string;
  clientId: string;
  bookingId: string;
  invoiceDate: string;
  dueDate?: string;
  transactionType: TransactionType;
  lineItems: InvoiceLineFormData[];
  billingName?: string;
  billingAddress?: string;
  companyAddress?: string;
  waitingMinutes?: number;
  waitingTotal?: number;
  isNightShift?: boolean;
  nightShiftAmount?: number;
  logoFile?: string;
  status?: InvoiceStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  terms?: string;
  paymentLink?: string;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  clientId?: string;
  status?: InvoiceStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  bookingId?: string;
}

export interface InvoiceResponse {
  data: {
    invoice: Invoice;
  };
  message: string;
  success: boolean;
}

export interface InvoicesResponse {
  data: {
    invoices: Invoice[];
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
