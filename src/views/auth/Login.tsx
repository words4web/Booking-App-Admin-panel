import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";

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
      let fcmToken = "";
      await requestNotificationPermission().then((token) => {
        if (token) {
          console.log("FCM Token:", token);
          fcmToken = token;
          localStorage.setItem(FCM_TOKEN, token);
        }
      });
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
    <div className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-200 shadow-lg">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
            <Lock className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-2xl font-semibold tracking-tight">
            Admin Login
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Secure access to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              formik={formik}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              formik={formik}
            />

            <Button
              type="submit"
              className="h-11 w-full text-sm font-medium"
              disabled={
                !formik.isValid ||
                !formik.dirty ||
                formik.isSubmitting ||
                isPending
              }>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
