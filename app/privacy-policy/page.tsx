"use client";

import {
  Shield,
  Lock,
  Eye,
  FileText,
  Info,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1e293b]">
      {/* Container */}
      <div className="max-w-5xl w-full space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 pb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
            <Shield size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Your trust is our priority. This policy outlines how we handle your
            data with transparency and care.
          </p>
        </header>

        {/* Main Content Areas */}
        <main className="space-y-6">
          {/* Section: Overview */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Info size={24} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Introduction
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              This Privacy Policy describes how{" "}
              <span className="font-semibold text-slate-800">
                DivineGo Logistics
              </span>{" "}
              collects, uses, and shares your personal information when you use
              our mobile application and admin panel.
            </p>
          </div>

          {/* Section: Data Collection - Card Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="p-3 bg-indigo-50 w-fit rounded-xl mb-6">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Personal Data
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex gap-3 items-start italic">
                  <ArrowRight
                    size={18}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  Full name, email & phone
                </li>
                <li className="flex gap-3 items-start italic">
                  <ArrowRight
                    size={18}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  Government identifiers (NI Number)
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="p-3 bg-purple-50 w-fit rounded-xl mb-6">
                <Eye size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Usage & Media
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex gap-3 items-start italic">
                  <ArrowRight
                    size={18}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  License & Passport documents
                </li>
                <li className="flex gap-3 items-start italic">
                  <ArrowRight
                    size={18}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  Device IDs for notifications
                </li>
              </ul>
            </div>
          </div>

          {/* Section: How we use it */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Lock size={24} className="text-blue-400" />
                Data Utilization & Security
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Your data is used strictly for identity verification, booking
                logistics, and critical app notifications. We never sell your
                data.
              </p>
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-bold text-sm">
                ENCRYPTED IN TRANSIT via TLS/HTTPS
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </div>

          {/* Section: Deletion */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Trash2 className="text-red-500" size={24} />
                  Data Deletion Rights
                </h2>
                <p className="text-slate-500">
                  You can request to delete your account at any time.
                </p>
              </div>
              <a
                href="/account-deletion"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Go to Deletion Page
              </a>
            </div>
          </div>

          {/* Footer Card */}
          <footer className="bg-blue-50 rounded-3xl p-8 text-center border border-blue-100 flex flex-col items-center space-y-4">
            <h3 className="text-lg font-bold text-blue-900">Questions?</h3>
            <p className="text-blue-700">
              Reach out to us at{" "}
              <span className="font-bold underline">appdivine23@gmail.com</span>
            </p>
            <div className="flex gap-6 pt-2">
              <span className="text-sm font-semibold text-slate-400 cursor-default">
                Privacy Protected
              </span>
              <span className="text-slate-300">|</span>
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} DivineGo Logistics
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
