const ROUTES_PATH = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: "/dashboard",
  COMPANIES: { BASE: "/companies", NEW: "/companies/new" },
  DRIVERS: "/drivers",
  CLIENTS: { BASE: "/clients" },
  PRODUCTS: "/products",
  BOOKINGS: {
    BASE: "/bookings",
    NEW: "/bookings/new",
    EDIT: (bookingId: string) => `/bookings/${bookingId}/edit`,
  },
  CALENDAR: "/calendar",
  INVOICES: "/invoices",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  VEHICLES: "/vehicles",
};

export default ROUTES_PATH;
