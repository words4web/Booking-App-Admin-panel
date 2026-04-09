import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Store,
  Contact2,
  Tags,
  ClipboardCheck,
  UserSquare2,
  Construction,
  CreditCard,
  Layout,
} from "lucide-react";

import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";

export function Overview() {
  const { user } = useAuth();

  const allQuickActions = [
    {
      title: "Calendar",
      description: "Comprehensive schedule and timeline view",
      icon: Layout,
      href: ROUTES_PATH.CALENDAR,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      title: "Company",
      description: "Registered companies and business profiles",
      icon: Store,
      href: ROUTES_PATH.COMPANIES.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      title: "Client",
      description: "Business clients and key contacts",
      icon: Contact2,
      href: ROUTES_PATH.CLIENTS.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      title: "Product",
      description: "Service products and concrete mix pricing",
      icon: Tags,
      href: ROUTES_PATH.PRODUCTS.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      title: "Bookings",
      description: "Live booking operations and status tracking",
      icon: ClipboardCheck,
      href: ROUTES_PATH.BOOKINGS.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      title: "Driver",
      description: "Driver records and assignment monitoring",
      icon: UserSquare2,
      href: ROUTES_PATH.DRIVERS.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      title: "Vehicle",
      description: "Fleet management and maintenance status",
      icon: Construction,
      href: ROUTES_PATH.VEHICLES.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      title: "Invoices",
      description: "Generate and manage invoices",
      icon: CreditCard,
      href: ROUTES_PATH.INVOICES.BASE,
      color: "bg-primary",
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
  ];

  const quickActions = allQuickActions.filter(
    (action) =>
      !action.roles ||
      (user?.role && action.roles.includes(user?.role as UserRoles)),
  );

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col gap-2 relative">
        {/* <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" /> */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
          DivineGo <span className="text-primary">Dashboard</span>
        </h1>
        {/* <p className="text-xl text-muted-foreground font-medium max-w-2xl">
          Your logistics empire at a glance. Streamlined, efficient, and ready
          for action.
        </p> */}
      </div>

      {/* Quick Actions Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">
            Rapid Operations
          </h2>
          <div className="h-px flex-1 bg-primary/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {quickActions?.map((action, idx) => {
            const Icon = action.icon;
            // Use a slightly lighter version of the provided color for the icon background if it's primary
            const iconBg =
              action.color === "bg-primary" ? "bg-primary" : action.color;

            return (
              <Link key={idx} href={action?.href} className="group">
                <Card className="relative overflow-hidden h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(60,10,80,0.1)] hover:-translate-y-3 bg-white/80 backdrop-blur-xl group-hover:ring-2 group-hover:ring-primary/20">
                  {/* Glassmorphism gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Floating geometric accent */}
                  <div
                    className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${action.color} opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-1000 blur-2xl`}
                  />

                  <CardContent className="p-6 flex items-center gap-4 relative z-10">
                    <div
                      className={`p-4 sm:p-5 md:p-7 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] ${iconBg} text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] md:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] group-hover:shadow-[0_25px_50px_-12px_rgba(60,10,80,0.4)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 flex-shrink-0`}>
                      <Icon className="h-6 w-6 sm:h-10 sm:w-10 md:h-14 md:w-14 stroke-[1.5]" />
                    </div>
                    <div className="flex-1 space-y-1 sm:space-y-3 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-500 truncate">
                          {action.title}
                        </h3>
                        <div className="p-1.5 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-700 hidden sm:block">
                          <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium leading-relaxed group-hover:text-foreground/70 transition-colors duration-500 line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
