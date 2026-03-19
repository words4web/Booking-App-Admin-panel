import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "@/src/schemas/auth.schema";
import { LoginValues } from "@/src/types/forms.types";

import { FormInput } from "@/src/components/forms/FormInput";
import { useLoginMutation } from "@/src/services/authManager/useAuthMutations";
import { requestNotificationPermission } from "@/lib/notifications";
import { FCM_TOKEN } from "@/src/constants/user.constants";

export function Login() {
  const { mutate, isPending } = useLoginMutation();

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      let fcmToken = localStorage.getItem(FCM_TOKEN) || "";

      if (!fcmToken) {
        const token = await requestNotificationPermission();
        if (token) {
          fcmToken = token;
          localStorage.setItem(FCM_TOKEN, token);
        }
      }

      const newValues = {
        ...values,
        deviceInfo: {
          platform: "WEB",
          fcmToken,
        },
      };
      mutate(newValues);
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4">
      {/* Decorative Background Accents */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" />
      <div
        className="absolute top-1/2 -right-20 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 animate-bounce"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"
        style={{ animationDuration: "6s" }}
      />

      <Card className="relative w-full max-w-md rounded-[2rem] border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] bg-white/70 backdrop-blur-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

        <CardHeader className="space-y-6 text-center pb-2 pt-4 relative z-10">
          <div className="mx-auto flex items-center justify-center">
            <div className="relative">
              <Image
                src="/divineLogo.png"
                alt="DivineGo Logo"
                width={160}
                height={160}
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

          <CardTitle className="text-4xl font-black tracking-tight text-slate-900">
            DivineGo <span className="text-primary">Admin</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-10 pb-6 relative z-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4 flex flex-col gap-10 mb-10">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                formik={formik}
                className="bg-white/40 border-slate-200/50 focus:bg-white transition-all rounded-xl h-12"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                formik={formik}
                className="bg-white/40 border-slate-200/50 focus:bg-white transition-all rounded-xl h-12"
              />
            </div>

            <Button
              type="submit"
              className="h-14 w-full text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
              disabled={!formik.isValid || !formik.dirty || isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
