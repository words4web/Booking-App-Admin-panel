import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ReactQueryProvider from "@/src/providers/react-query-provider";
import { AuthProvider } from "@/src/services/authManager";
import { useEffect } from "react";
import { listenToForegroundMessages } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Logistics Admin Panel",
  description: "Admin dashboard for logistics management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    listenToForegroundMessages();
  }, []);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
