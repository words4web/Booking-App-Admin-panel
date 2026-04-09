const Admin_Base = "/admin";

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${Admin_Base}/auth/login`,
    PROFILE: `${Admin_Base}/auth/profile`,
    LOGOUT: `${Admin_Base}/auth/logout`,
    REFRESH_TOKEN: `${Admin_Base}/auth/refresh-token`,
  },
  DRIVERS: {
    GET_ALL_DRIVERS: `${Admin_Base}/drivers`,
    GET_DELETED_BY_USERS: `${Admin_Base}/drivers/deleted-by-users`,
    GET_DRIVER_DETAILS: (driverId: string) =>
      `${Admin_Base}/drivers/${driverId}`,
    VERIFY_DOCUMENT: (driverId: string) =>
      `${Admin_Base}/drivers/${driverId}/verify-document`,
    REVIEW_DELETION: (driverId: string) =>
      `${Admin_Base}/drivers/${driverId}/review-deletion`,
    DELETE: (driverId: string) => `${Admin_Base}/drivers/${driverId}`,
  },
  COMPANIES: {
    CREATE: `${Admin_Base}/companies`,
    GET_ALL: `${Admin_Base}/companies`,
    GET_BY_ID: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
    UPDATE: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
    DELETE: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
  },
  CLIENTS: {
    CREATE: `${Admin_Base}/clients`,
    GET_ALL: `${Admin_Base}/clients`,
    GET_BY_ID: (clientId: string) => `${Admin_Base}/clients/${clientId}`,
    UPDATE: (clientId: string) => `${Admin_Base}/clients/${clientId}`,
    DELETE: (clientId: string) => `${Admin_Base}/clients/${clientId}`,
  },
  NOTIFICATIONS: {
    GET_ALL: "/notification",
    MARK_ALL_READ: "/notification/read-all",
    MARK_READ: (id: string) => `/notification/${id}/read`,
    UNREAD_COUNT: "/notification/unread-count",
  },
  DEVICES: {
    SYNC: `${Admin_Base}/devices/sync`,
    REMOVE: `${Admin_Base}/devices/remove`,
  },
  SETTINGS: {
    GET: "/admin/settings",
    UPDATE_PREFERENCE: "/admin/settings/notification-preference",
  },
  PRODUCTS: {
    CREATE: `${Admin_Base}/products`,
    GET_ALL: `${Admin_Base}/products`,
    GET_BY_ID: (productId: string) => `${Admin_Base}/products/${productId}`,
    UPDATE: (productId: string) => `${Admin_Base}/products/${productId}`,
    DELETE: (productId: string) => `${Admin_Base}/products/${productId}`,
  },
  VEHICLES: {
    CREATE: `${Admin_Base}/vehicles`,
    GET_ALL: `${Admin_Base}/vehicles`,
    GET_VEHICLE_DETAILS: (vehicleId: string) =>
      `${Admin_Base}/vehicles/${vehicleId}`,
    UPDATE: (vehicleId: string) => `${Admin_Base}/vehicles/${vehicleId}`,
    DELETE: (vehicleId: string) => `${Admin_Base}/vehicles/${vehicleId}`,
  },
  BOOKINGS: {
    CREATE: `${Admin_Base}/bookings`,
    GET_ALL: `${Admin_Base}/bookings`,
    GET_BY_ID: (bookingId: string) => `${Admin_Base}/bookings/${bookingId}`,
    UPDATE: (bookingId: string) => `${Admin_Base}/bookings/${bookingId}`,
    DELETE: (bookingId: string) => `${Admin_Base}/bookings/${bookingId}`,
    DELETE_PHOTO: (bookingId: string, key: string) =>
      `${Admin_Base}/bookings/${bookingId}/photos?key=${encodeURIComponent(key)}`,
    REVIEW: (bookingId: string) => `${Admin_Base}/bookings/${bookingId}/review`,
    CALENDAR: `${Admin_Base}/bookings/calendar`,
  },
  INVOICES: {
    CREATE: `${Admin_Base}/invoices`,
    GET_ALL: `${Admin_Base}/invoices`,
    GET_BY_ID: (invoiceId: string) => `${Admin_Base}/invoices/${invoiceId}`,
    UPDATE: (invoiceId: string) => `${Admin_Base}/invoices/${invoiceId}`,
    DELETE: (invoiceId: string) => `${Admin_Base}/invoices/${invoiceId}`,
    TOGGLE_PAYMENT: (invoiceId: string) =>
      `${Admin_Base}/invoices/${invoiceId}/toggle-payment`,
    PREVIEW: `${Admin_Base}/invoices/preview`,
    DOWNLOAD: (invoiceId: string) =>
      `${Admin_Base}/invoices/${invoiceId}/download`,
    LOGOS: `${Admin_Base}/invoices/logos`,
    SEND_EMAIL: (invoiceId: string) =>
      `${Admin_Base}/invoices/${invoiceId}/send-email`,
    SEND_PAYMENT_LINK: (invoiceId: string) =>
      `${Admin_Base}/invoices/${invoiceId}/send-payment-link`,
  },
  CMS: {
    GET_ALL: "/cms",
    GET_BY_SLUG: (slug: string) => `/cms/${slug}`,
    UPSERT: "/cms",
  },
  CHAT: {
    GET_ROOM: (token: string) => `/chat/room/${token}`,
    GET_MESSAGES: (token: string, after?: string) => 
      `/chat/messages/${token}${after ? `?after=${after}` : ''}`,
    SEND_PUBLIC: (token: string) => `/chat/messages/${token}`,
    SEND_ADMIN: (token: string) => `/admin/chat/messages/${token}`,
    CLOSE: (token: string) => `/admin/chat/room/${token}/close`,
  },
};

export default API_ENDPOINTS;
