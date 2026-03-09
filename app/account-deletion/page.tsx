"use client";

import { Mail, Trash2, Info } from "lucide-react";

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 font-sans text-slate-900">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white text-center shadow-lg">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Trash2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Account Deletion & Data Request
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-xl mx-auto opacity-90">
            Request to permanently delete your Divine account and associated
            personal data.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-12">
          {/* Steps */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                1
              </div>
              How to request deletion
            </h2>
            <div className="grid gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                <h3 className="font-bold mb-3 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <Mail size={18} className="text-blue-500" />
                  Via Email
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Send an email to{" "}
                  <a
                    href="mailto:appdivine23@gmail.com"
                    className="text-blue-600 font-semibold hover:underline">
                    appdivine23@gmail.com
                  </a>{" "}
                  from your registered email address with the subject{" "}
                  <strong>"Account Deletion Request"</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Data Policy */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              What data will be deleted?
            </h3>
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1 mt-1 bg-white p-2 rounded-lg shadow-sm">
                  <Info size={20} className="text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">
                    Permanently Deleted
                  </p>
                  <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside marker:text-blue-400">
                    <li>
                      Your profile information (name, email, phone number)
                    </li>
                    <li>Uploaded legal documents and IDs</li>
                    <li>Application settings and preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Notice */}
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
            <Trash2 size={24} className="text-amber-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="font-bold text-amber-900">Permanent Action</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                Once your account is deleted, the action is irreversible.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-8 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-slate-500 text-sm font-medium mb-4 sm:mb-0">
            © 2026 Divine Logistics Solutions
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="/privacy-policy"
              className="text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors">
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
