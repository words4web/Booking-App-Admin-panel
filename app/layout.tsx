import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ReactQueryProvider from "@/src/providers/react-query-provider";
import { AuthProvider } from "@/src/services/authManager";
import NotificationListener from "@/src/components/NotificationListener";

export const metadata: Metadata = {
  title: "DivineGo Admin Panel",
  description: "Admin dashboard for DivineGo booking management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <NotificationListener />
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
