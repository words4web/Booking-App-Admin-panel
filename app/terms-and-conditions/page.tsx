"use client";

import { FileText, Lock, Info } from "lucide-react";
import { useCMSDetailQuery } from "@/src/services/cmsManager/useCMSQueries";
import { HtmlRenderer } from "@/src/components/common/HtmlRenderer";
import { CommonLoader } from "@/src/components/common/CommonLoader";

export default function TermsAndConditionsPage() {
  const { data: cmsData, isLoading } = useCMSDetailQuery("terms-and-conditions");

  if (isLoading) return <CommonLoader />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1e293b]">
      {/* Container */}
      <div className="max-w-4xl w-full space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 pb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
            <FileText size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            {cmsData?.title || "Terms & Conditions"}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services. 
            They define the legal agreement between you and RKB Kent Concrete Ltd.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_20px_50px_rgba(60,10,80,0.05)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Info size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Terms Details
              </h2>
            </div>
            
            <HtmlRenderer html={cmsData?.content || ""} />
          </div>

          {/* Legal Banner */}
          <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6 max-w-2xl">
              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <Lock size={24} className="text-primary" />
                Legal Compliance
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Our terms are designed to provide a fair and transparent framework 
                for all users, ensuring a safe and reliable logistics environment for everyone.
              </p>
              <div className="inline-block px-6 py-3 bg-primary/20 border border-primary/30 rounded-2xl text-primary font-black text-xs uppercase tracking-widest">
                LAST UPDATED: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
          </div>

          {/* Footer Card */}
          <footer className="bg-primary/5 rounded-[3rem] p-10 text-center border border-primary/10 flex flex-col items-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-primary tracking-tight">Questions?</h3>
              <p className="text-slate-500 font-medium">
                If you have any questions regarding our terms, please feel free to contact us.
              </p>
            </div>
            <a 
              href="mailto:info@appdivine.rkbkentconcrete.co.uk"
              className="text-primary font-black text-lg underline hover:text-primary/80 transition-colors"
            >
              info@appdivine.rkbkentconcrete.co.uk
            </a>
            <div className="flex items-center gap-6 pt-4 border-t border-primary/10 w-full justify-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                © {new Date().getFullYear()} RKB Kent Concrete Ltd
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
