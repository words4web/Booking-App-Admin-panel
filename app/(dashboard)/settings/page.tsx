"use client";

import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user, removeUserContext } = useAuth();
  // const { data: settings, isLoading } = useSettingsQuery();
  // const updatePreference = useUpdateNotificationPreferenceMutation();

  // if (isLoading) {
  //   return <CommonLoader message="Loading settings..." />;
  // }

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
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <Avatar
                className="ring-4 ring-primary/10 shadow-xl"
                style={{
                  height: 82,
                  width: 82,
                }}>
                <AvatarImage src="/placeholder-user.jpg" alt={user?.fullName} />
                <AvatarFallback
                  className="bg-primary/5 text-primary font-black text-2xl"
                  style={{ fontSize: 36 }}>
                  {user?.fullName
                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")}
                </AvatarFallback>
              </Avatar>
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
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        {/* <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Push Notifications</h4>
                <p className="text-xs text-muted-foreground font-medium leading-normal max-w-sm">
                  Receive real-time alerts on this device about new bookings,
                  driver updates, and system notifications.
                </p>
              </div>
              <Switch
                checked={settings?.isNotificationEnabled}
                onCheckedChange={(checked) => updatePreference.mutate(checked)}
                disabled={updatePreference.isPending}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Danger Zone */}
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
              onClick={removeUserContext}
              variant="destructive"
              className="h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-wider transition-all gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border-none">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
