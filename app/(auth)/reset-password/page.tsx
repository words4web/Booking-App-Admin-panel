"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  Lock,
  Fingerprint,
} from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] bg-card/50 backdrop-blur-2xl ring-1 ring-border/50">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <ShieldCheck className="h-8 w-8 text-primary shadow-sm" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tighter">
              Security <span className="text-primary">Update</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-sm">
              Confirm identity via your registered device to set a new
              administrative password.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="otp"
                  className="text-xs font-black uppercase tracking-widest text-primary/70">
                  Verification Code
                </Label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-primary hover:underline transition-all">
                  Resend Code
                </button>
              </div>
              <div className="flex justify-center">
                <InputOTP maxLength={6} id="otp">
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-14 w-12 rounded-xl text-lg font-black border-2 transition-all focus:border-primary focus:ring-primary/20 bg-background/50"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" title="New Password" />
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary bg-background/50 font-medium"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm New Password"
                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary bg-background/50 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2">
              <Fingerprint className="h-5 w-5" />
              Reset Admin Password
            </Button>
          </form>
          <div className="pt-2 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Return to Command Center
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
