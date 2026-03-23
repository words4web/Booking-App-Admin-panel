"use client";

import { useAuth } from "@/src/services/authManager";
import { useLogoutMutation } from "@/src/services/authManager/useAuthMutations";
import { FCM_TOKEN } from "@/src/constants/user.constants";
import { UserRoles } from "@/src/enums/roles.enum";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const onLogout = () => {
    const fcmToken = localStorage.getItem(FCM_TOKEN);
    logout({ fcmToken });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">
                {user?.fullName}
              </h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Shield className="h-4 w-4" />
                  {user?.role === UserRoles.SUPER_ADMIN
                    ? "Super Admin"
                    : "Company Admin"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account Actions
            </CardTitle>
            <CardDescription>Sign out of your account</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0!" style={{ paddingTop: 0 }}>
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={() => setIsSignOutModalOpen(true)}
              className="h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-wider transition-all gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border-none">
              <LogOut className="h-4 w-4" />
              {isPending ? "Signing Out..." : "Sign Out"}
            </Button>

            <ConfirmModal
              isOpen={isSignOutModalOpen}
              onOpenChange={setIsSignOutModalOpen}
              title="Confirm Sign Out"
              description="Are you sure you want to sign out of your account?"
              confirmText="Sign Out"
              cancelText="Cancel"
              onConfirm={onLogout}
              isLoading={isPending}
              icon={LogOut}
              variant="destructive"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
