"use client";

import {
  Mail,
  Clock,
  Building2,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  HeadphonesIcon,
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1e293b]">
      {/* Container */}
      <div className="max-w-4xl w-full space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 pb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
            <HeadphonesIcon size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            App Support
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            For support regarding the DivineGo app, contact us below. We're here
            to help you with any questions or issues.
          </p>
        </header>

        {/* Main Content Areas */}
        <main className="space-y-6">
          {/* Support Email - Primary Contact */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Mail size={24} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Email Support
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Our primary support channel is via email. Please reach out to us
              for technical assistance or general feedback.
            </p>
            <a
              href="mailto:info@appdivine.rkbkentconcrete.co.uk"
              className="inline-flex items-center gap-3 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors group">
              info@appdivine.rkbkentconcrete.co.uk
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* grid for details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Response Time */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="p-3 bg-indigo-50 w-fit rounded-xl mb-6">
                <Clock size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Response Expectation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We value your time. Our team typically responds to all inquiries
                within{" "}
                <span className="font-semibold text-slate-900">
                  24–48 hours
                </span>{" "}
                during business days.
              </p>
            </div>

            {/* Business Identity */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="p-3 bg-purple-50 w-fit rounded-xl mb-6">
                <Building2 size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Business Identity
              </h3>
              <p className="text-slate-600 leading-relaxed">
                The DivineGo app is owned and operated by{" "}
                <span className="font-semibold text-slate-900">
                  RKB Kent Concrete Ltd
                </span>
                .
              </p>
            </div>
          </div>

          {/* Compliance Info */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <ShieldCheck size={24} className="text-blue-400" />
                Commitment to Quality
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We are committed to providing a seamless experience for our
                users. If you encounter any bugs or have suggestions for
                improvement, please don't hesitate to contact us.
              </p>
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-bold text-sm">
                APP STORE COMPLIANT SUPPORT
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </div>

          {/* Links Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <MessageCircle className="text-blue-500" size={24} />
                  Privacy & Data
                </h2>
                <p className="text-slate-500">
                  Learn more about how we protect your data.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/privacy-policy"
                  className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all">
                  Privacy Policy
                </a>
                <a
                  href="/account-deletion"
                  className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Account Deletion
                </a>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <footer className="bg-blue-50 rounded-3xl p-8 text-center border border-blue-100 flex flex-col items-center space-y-4">
            <div className="flex gap-6">
              <span className="text-sm font-semibold text-slate-400 cursor-default">
                Support Portal
              </span>
              <span className="text-slate-300">|</span>
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} RKB Kent Concrete Ltd
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
