"use client";

import { useRouter } from "next/navigation";
import { DocumentViewer } from "@/src/components/drivers/DocumentViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { DriverTabsData } from "@/lib/DriverTabsData";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import {
  useDriverDetailsQuery,
  useVerifyDocumentMutation,
} from "@/src/services/driverManager/useDriverQueries";

interface DriverDetailsProps {
  driverId: string;
}

export function DriverDetails({ driverId }: DriverDetailsProps) {
  const router = useRouter();
  const { data: driver, isLoading, error } = useDriverDetailsQuery(driverId);

  const { mutateAsync: verifyDocument } = useVerifyDocumentMutation(driverId);

  const handleVerifyDocument = async (
    documentType: string,
    isVerified: boolean,
    reason?: string,
  ) => {
    await verifyDocument({ documentType, isVerified, reason });
  };

  if (isLoading)
    return (
      <CommonLoader fullScreen={false} message="Loading driver details..." />
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching driver details
      </div>
    );
  if (!driver) return <div className="p-8 text-center">Driver not found</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Driver Verification
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Manage and verify driver documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {driver.isDocumentsVerified ? (
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 mr-2" /> Fully Verified
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-600 border-amber-100 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 mr-2" /> Pending Verification
            </Badge>
          )}
        </div>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <Tabs defaultValue="profile" className="w-full">
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-fit inline-flex min-w-min">
              {DriverTabsData.map((data) => (
                <TabsTrigger
                  key={data.id}
                  value={data.id}
                  className="rounded-xl px-4 sm:px-6 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-white">
                  {data.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <CardContent className="p-8">
            <TabsContent
              value="profile"
              className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                {/* Profile Image Column */}
                <div className="md:col-span-4 flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-emerald-400/20 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
                      {driver.profileImage ? (
                        <Image
                          src={driver.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <AlertCircle className="w-10 h-10 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            No Photo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <DetailItem
                    label="Full Name"
                    value={driver?.fullName}
                    highlight
                  />
                  <DetailItem label="Email Address" value={driver?.email} />
                  <DetailItem
                    label="Mobile Number"
                    value={driver?.mobileNumber}
                  />
                  <DetailItem
                    label="National Insurance Number"
                    value={driver?.nationalInsuranceNumber as string}
                  />
                  <DetailItem
                    label="Account Created"
                    value={new Date(driver?.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="license"
              className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentViewer
                  title="Front Side"
                  imageUrl={driver?.license?.frontImage?.url || null}
                  isVerified={driver?.license?.frontImage?.isVerified || false}
                  reason={driver?.license?.frontImage?.reason || null}
                  onVerify={(verified, reason) =>
                    handleVerifyDocument("license.frontImage", verified, reason)
                  }
                />
                <DocumentViewer
                  title="Back Side"
                  imageUrl={driver?.license?.backImage?.url || null}
                  isVerified={driver?.license?.backImage?.isVerified || false}
                  reason={driver?.license?.backImage?.reason || null}
                  onVerify={(verified, reason) =>
                    handleVerifyDocument("license.backImage", verified, reason)
                  }
                />
              </div>
            </TabsContent>

            <TabsContent
              value="passport"
              className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentViewer
                  title="Bio Data Page"
                  imageUrl={driver?.passport?.bioDataPage?.url || null}
                  isVerified={
                    driver?.passport?.bioDataPage?.isVerified || false
                  }
                  reason={driver?.passport?.bioDataPage?.reason || null}
                  onVerify={(verified, reason) =>
                    handleVerifyDocument(
                      "passport.bioDataPage",
                      verified,
                      reason,
                    )
                  }
                />
                <DocumentViewer
                  title="Signature Page"
                  imageUrl={driver?.passport?.signaturePage?.url || null}
                  isVerified={
                    driver?.passport?.signaturePage?.isVerified || false
                  }
                  reason={driver?.passport?.signaturePage?.reason || null}
                  onVerify={(verified, reason) =>
                    handleVerifyDocument(
                      "passport.signaturePage",
                      verified,
                      reason,
                    )
                  }
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

function DetailItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1.5 group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p
        className={`text-base font-bold tracking-tight shadow-none ${highlight ? "text-primary" : "text-slate-700"}`}>
        {value || "—"}
      </p>
      <div className="h-0.5 w-8 bg-slate-100 rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-primary/10"></div>
    </div>
  );
}
