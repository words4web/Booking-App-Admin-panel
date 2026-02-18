const Admin_Base = "/admin";

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${Admin_Base}/auth/login`,
    PROFILE: `${Admin_Base}/auth/profile`,
    LOGOUT: `${Admin_Base}/auth/logout`,
  },
  DRIVERS: {
    GET_ALL_DRIVERS: `${Admin_Base}/drivers`,
    GET_DRIVER_DETAILS: (driverId: string) =>
      `${Admin_Base}/drivers/${driverId}`,
    VERIFY_DOCUMENT: (driverId: string) =>
      `${Admin_Base}/drivers/${driverId}/verify-document`,
  },
  COMPANIES: {
    CREATE: `${Admin_Base}/companies`,
    GET_ALL: `${Admin_Base}/companies`,
    GET_BY_ID: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
    UPDATE: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
    DELETE: (companyId: string) => `${Admin_Base}/companies/${companyId}`,
  },
};

export default API_ENDPOINTS;
