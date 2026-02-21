// import axios, {
//   type AxiosResponse,
//   type InternalAxiosRequestConfig,
// } from "axios";
// import { API_BASE_URL } from "./endpoints";
// import commonUtils from "@/utils/common.utils";
// import ROUTE_PATHS from "@/routes/route-paths";
// import { addToast } from "@heroui/react";
// const http = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });
// http.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem("token");
//     if (token && config.headers) {
//       config.headers.Authorization = Bearer ${token};
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );
// http.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response.data;
//   },
//   (error) => {
//     const errorData = error?.response?.data;
//     const currentPath = window.location.pathname;
//     if (
//       currentPath !== ROUTE_PATHS.AUTH.LOGIN &&
//       (error?.status === 401 || errorData?.code === 401)
//     ) {
//       addToast({
//         title: "Session expired!",
//         color: "warning",
//       });
//       commonUtils.onLogout();
//     } else {
//       addToast({
//         title: errorData?.message || "Something went wrong!",
//         color: "danger",
//       });
//     }
//     return Promise.reject(error.response?.data);
// },
// );
// export default http;

import ROUTES_PATH from "@/lib/Route_Paths";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to headers
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint = requestUrl.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear storage and redirect to login only for non-auth endpoints
      // (e.g. session expired), not for login failures (wrong password)
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = ROUTES_PATH.AUTH.LOGIN;
      }
    }
    // Optionally log error for debugging
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
