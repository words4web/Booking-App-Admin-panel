export enum BookingStatus {
  SCHEDULED = 'Scheduled',
  ACCEPTED = 'Accepted',
  ON_THE_WAY = 'On the Way',
  JOB_STARTED = 'Job Started',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ServiceType {
  RMC = 'RMC',
  HAULAGE = 'Haulage',
  OTHER = 'Other',
}

export enum WaitingTimeStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export type WaitingTimeUnit = '15min' | '30min' | '60min';
