import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  UserPlus,
  FilePlus,
  Settings,
  Package,
  Truck,
  ArrowRight,
} from "lucide-react";

export function Overview() {
  const quickActions = [
    {
      title: "Manage Companies",
      description: "Configure and manage company profiles",
      icon: Settings,
      href: "/companies",
      color: "bg-slate-900",
      hoverColor: "hover:bg-slate-950",
    },
    {
      title: "Manage Customers",
      description: "Register and organize business clients",
      icon: UserPlus,
      href: "/customers/new",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      title: "Manage Products",
      description: "Update your services and rates",
      icon: Package,
      href: "/products",
      color: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
    },

    {
      title: "Manage Bookings",
      description: "Create and track shipment bookings",
      icon: Plus,
      href: "/bookings/new",
      color: "bg-primary",
      hoverColor: "hover:bg-primary/90",
    },
    {
      title: "Manage Drivers",
      description: "Onboard and monitor delivery drivers",
      icon: Truck,
      href: "/drivers",
      color: "bg-black",
      hoverColor: "hover:bg-gray-900",
    },
    {
      title: "Manage Invoices",
      description: "Generate and handle billing invoices",
      icon: FilePlus,
      href: "/invoices",
      color: "bg-blue-800",
      hoverColor: "hover:bg-blue-900",
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col gap-2 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <h1 className="text-5xl font-black tracking-tighter lg:text-6xl text-foreground">
          Command <span className="text-primary">Center</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl">
          Your logistics empire at a glance. Streamlined, efficient, and ready
          for action.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">
            Rapid Operations
          </h2>
          <div className="h-px flex-1 bg-primary/10" />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            // Use a slightly lighter version of the provided color for the icon background if it's primary
            const iconBg =
              action.color === "bg-primary" ? "bg-primary" : action.color;

            return (
              <Link key={idx} href={action.href} className="group">
                <Card className="relative overflow-hidden h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:-translate-y-3 bg-white/80 backdrop-blur-xl group-hover:ring-2 group-hover:ring-primary/20">
                  {/* Glassmorphism gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Floating geometric accent */}
                  <div
                    className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${action.color} opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-1000 blur-2xl`}
                  />

                  <CardContent className="p-12 flex items-center gap-10 relative z-10">
                    <div
                      className={`p-7 rounded-[2.5rem] ${iconBg} text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] group-hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 flex-shrink-0`}>
                      <Icon className="h-14 w-14 stroke-[1.5]" />
                    </div>
                    <div className="flex-1 space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
                          {action.title}
                        </h3>
                        <div className="p-2 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-6 group-hover:translate-x-0 duration-700">
                          <ArrowRight className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <p className="text-muted-foreground text-base font-medium leading-relaxed group-hover:text-foreground/70 transition-colors duration-500">
                        {action.description}. Elevate your logistics experience.
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
