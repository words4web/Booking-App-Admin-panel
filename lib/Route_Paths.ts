const ROUTES_PATH = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: "/dashboard",
  COMPANIES: {
    BASE: "/companies",
    NEW: "/companies/new",
    EDIT: (companyId: string) => `/companies/${companyId}/edit`,
    VIEW: (companyId: string) => `/companies/${companyId}`,
  },
  DRIVERS: {
    BASE: "/drivers",
    NEW: "/drivers/new",
    EDIT: (driverId: string) => `/drivers/${driverId}/edit`,
    VIEW: (driverId: string) => `/drivers/${driverId}`,
  },
  CLIENTS: {
    BASE: "/clients",
    NEW: "/clients/new",
    EDIT: (clientId: string) => `/clients/${clientId}/edit`,
    VIEW: (clientId: string) => `/clients/${clientId}`,
  },
  PRODUCTS: {
    BASE: "/products",
    NEW: "/products/new",
    EDIT: (productId: string) => `/products/${productId}/edit`,
    VIEW: (productId: string) => `/products/${productId}`,
  },
  BOOKINGS: {
    BASE: "/bookings",
    NEW: "/bookings/new",
    EDIT: (bookingId: string) => `/bookings/${bookingId}/edit`,
    VIEW: (bookingId: string) => `/bookings/${bookingId}`,
  },
  CALENDAR: "/calendar",
  INVOICES: {
    BASE: "/invoices",
    NEW: "/invoices/new",
    NEW_WITH_BOOKING: (bookingId: string) =>
      `/invoices/new?bookingId=${bookingId}`,
    EDIT: (invoiceId: string) => `/invoices/${invoiceId}/edit`,
    VIEW: (invoiceId: string) => `/invoices/${invoiceId}`,
  },
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  VEHICLES: {
    BASE: "/vehicles",
    NEW: "/vehicles/new",
    EDIT: (vehicleId: string) => `/vehicles/${vehicleId}/edit`,
    VIEW: (vehicleId: string) => `/vehicles/${vehicleId}`,
  },
  CMS: "/cms",
};

export default ROUTES_PATH;
