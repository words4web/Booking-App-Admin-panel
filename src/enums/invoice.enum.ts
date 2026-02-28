export enum InvoiceStatus {
  DRAFT = "Draft",
  SENT = "Sent",
  PAID = "Paid",
  OVERDUE = "Overdue",
}

export enum PaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
  FAILED = "Failed",
  OVERDUE = "Overdue",
}

export enum TransactionType {
  SALES = "Sales Invoice",
  CREDIT_NOTE = "Credit Note",
}
