export enum BookingStatus {
  SCHEDULED = "Scheduled",
  ACCEPTED = "Accepted",
  JOB_STARTED = "Job Started",
  JOB_SUBMITTED = "Job Submitted",
  JOB_REJECTED = "Job Rejected",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum ServiceType {
  RMC = "RMC",
  HAULAGE = "Haulage",
  OTHER = "Other",
}

export enum WaitingTimeStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export type WaitingTimeUnit = "15min" | "30min" | "60min";
