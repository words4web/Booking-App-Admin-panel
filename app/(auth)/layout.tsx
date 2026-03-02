import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">{children}</div>
    </div>
  );
}
