"use client";

import { use } from "react";
import { useVehicleDetailsQuery } from "@/src/services/vehicleManager/useVehicleQueries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { Truck, Calendar, Hash, ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";

interface VehicleDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { id } = use(params);
  const { data: vehicleData, isLoading, error } = useVehicleDetailsQuery(id);

  if (isLoading) {
    return (
      <CommonLoader fullScreen={false} message="Loading vehicle details..." />
    );
  }

  if (error || !vehicleData?.vehicle) {
    return (
      <div className="p-8 text-center text-red-500">
        Vehicle not found or an error occurred.
      </div>
    );
  }

  const { vehicle } = vehicleData;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href={ROUTES_PATH.VEHICLES}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Details</h1>
        </div>
        <Button asChild className="rounded-2xl gap-2">
          <Link href={`${ROUTES_PATH.VEHICLES}/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Vehicle
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[2rem] bg-primary/10 text-primary shadow-inner">
              <Truck className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {vehicle.vehicleName}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium text-base">
                Fleet ID: {vehicle._id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 group">
                <div className="p-3 rounded-2xl bg-white text-slate-400 border border-slate-100 shadow-sm group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Registration Number
                  </p>
                  <p className="text-xl font-extrabold text-slate-700 tracking-tight group-hover:text-primary transition-colors">
                    {vehicle.vehicleNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 group">
                <div className="p-3 rounded-2xl bg-white text-slate-400 border border-slate-100 shadow-sm group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Added On
                  </p>
                  <p className="text-xl font-extrabold text-slate-700 tracking-tight group-hover:text-primary transition-colors">
                    {new Date(vehicle.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-primary/10">
              <Truck className="h-16 w-16 text-primary/20 mb-4" />
              <p className="text-primary/60 font-medium max-w-[200px]">
                More vehicle statistics and tracking coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
