"use client";

import { Mail, Trash2, Info, ArrowRight, ShieldCheck } from "lucide-react";

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1e293b]">
      {/* Container */}
      <div className="max-w-5xl w-full space-y-10">
        {/* Header Section */}
        <header className="text-center space-y-6 pb-4">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
            <Trash2 size={40} className="text-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Account Deletion
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We're sorry to see you go. This page provides clear instructions on
            how to request the permanent deletion of your account and data.
          </p>
        </header>

        {/* Main Content Areas */}
        <main className="grid gap-6">
          {/* Section: How to request */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-xl">
                <Mail size={24} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                1. How to request deletion
              </h2>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
              <p className="text-slate-700 text-lg">
                Send an email to{" "}
                <a
                  href="mailto:info@appdivine.rkbkentconcrete.co.uk"
                  className="text-primary font-bold hover:underline">
                  info@appdivine.rkbkentconcrete.co.uk
                </a>{" "}
                from your registered email address with the subject{" "}
                <span className="font-bold">"Account Deletion Request"</span>.
              </p>
            </div>
          </div>

          {/* Section: What's deleted */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Info size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                2. What data will be deleted?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-700">Account Details</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-slate-500 text-sm italic">
                    <ArrowRight
                      size={16}
                      className="text-primary/60 mt-0.5 flex-shrink-0"
                    />
                    Full name, email and phone number
                  </li>
                  <li className="flex gap-3 text-slate-500 text-sm italic">
                    <ArrowRight
                      size={16}
                      className="text-primary/60 mt-0.5 flex-shrink-0"
                    />
                    Government ID details (NI Number)
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-700">Media & Settings</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-slate-500 text-sm italic">
                    <ArrowRight
                      size={16}
                      className="text-primary/60 mt-0.5 flex-shrink-0"
                    />
                    Profile photo, license & passport scans
                  </li>
                  <li className="flex gap-3 text-slate-500 text-sm italic">
                    <ArrowRight
                      size={16}
                      className="text-primary/60 mt-0.5 flex-shrink-0"
                    />
                    App preferences and notification IDs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 sm:p-10 flex gap-6 items-start">
            <div className="p-3 bg-white rounded-xl shadow-sm text-red-600 flex-shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-red-900 focus:outline-none">
                Irreversible Action
              </h3>
              <p className="text-red-700 leading-relaxed italic">
                Please note that once your account is deleted, the action is
                permanent and cannot be undone. No data can be recovered after
                the process is complete.
              </p>
            </div>
          </div>

          {/* Footer Card */}
          <footer className="bg-slate-900 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <p className="text-slate-400 text-sm font-medium">
                © {new Date().getFullYear()} RKB Kent Concrete Ltd
              </p>
              <div className="flex gap-6">
                <a
                  href="/privacy-policy"
                  className="text-sm font-bold text-primary hover:text-primary/80">
                  Privacy Policy
                </a>
                <span className="text-slate-700">|</span>
                <p className="text-sm text-slate-500">Secure Data Management</p>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </footer>
        </main>
      </div>
    </div>
  );
}
