"use client";

import {
  useAllCMSQuery,
  useUpsertCMSMutation,
} from "@/src/services/cmsManager/useCMSQueries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { CMSForm } from "@/src/components/forms/CMSForm";
import { useState } from "react";

const PRIVACY_SLUG = "privacy-policy";
const TERMS_SLUG = "terms-and-conditions";

export default function CMSManagementPage() {
  const { data: cmsList, isLoading } = useAllCMSQuery();
  const upsertMutation = useUpsertCMSMutation();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const privacyPage = cmsList?.find((cms) => cms.slug === PRIVACY_SLUG);
  const termsPage = cmsList?.find((cms) => cms.slug === TERMS_SLUG);

  const handleSubmit = (formData: any) => {
    upsertMutation.mutate(formData, {
      onSuccess: () => {
        setActiveTab(null);
      },
    });
  };

  if (isLoading) return <CommonLoader />;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-10">
      <div className="flex flex-col gap-2 text-center mb-4">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
          CMS Revamp
        </h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
          Legal Document Management
        </p>
      </div>

      {!activeTab ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Privacy Policy Prompt */}
          <Card
            className="group cursor-pointer border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(60,10,80,0.1)] transition-all duration-500 rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-slate-100 hover:ring-primary/20"
            onClick={() => setActiveTab(PRIVACY_SLUG)}>
            <CardHeader className="p-10 pb-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                  Privacy Policy
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Protect your users' data and clarify your usage terms.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0 text-center">
              <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-primary/5 px-6 py-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                Edit Page <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions Prompt */}
          <Card
            className="group cursor-pointer border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(60,10,80,0.1)] transition-all duration-500 rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-slate-100 hover:ring-primary/20"
            onClick={() => setActiveTab(TERMS_SLUG)}>
            <CardHeader className="p-10 pb-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <FileText className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                  Terms & Conditions
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Define the rules, requirements, and legal standards for your
                  app.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0 text-center">
              <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-primary/5 px-6 py-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                Edit Page <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CMSForm
            isEdit={!!(activeTab === PRIVACY_SLUG ? privacyPage : termsPage)}
            initialData={
              activeTab === PRIVACY_SLUG
                ? privacyPage || { slug: PRIVACY_SLUG, title: "", content: "" }
                : termsPage || { slug: TERMS_SLUG, title: "", content: "" }
            }
            onSubmit={handleSubmit}
            onCancel={() => setActiveTab(null)}
            isPending={upsertMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
