import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import { useSendInvoiceEmailMutation } from "@/src/services/invoiceManager/useInvoiceQueries";

interface EmailInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  defaultEmail: string;
}

const EmailInvoiceModal: React.FC<EmailInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  defaultEmail,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const sendEmailMutation = useSendInvoiceEmailMutation();

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail, isOpen]);

  const handleSend = () => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return; // Button is already disabled for empty email, but guard format too
    }
    sendEmailMutation.mutate(
      { id: invoiceId, email: trimmedEmail },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-[480px] p-0 overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-slate-50/95 backdrop-blur-xl z-[100] rounded-3xl">
        <DialogHeader className="p-8 pb-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Mail className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Mail className="h-6 w-6 text-white" />
            </div>
            Send Invoice
          </DialogTitle>
          <p className="text-blue-100 text-sm font-medium mt-2 leading-relaxed opacity-90">
            Invoice #{invoiceNumber} will be delivered to the client.
          </p>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-sm font-bold text-slate-700 ml-1">
              Recipient Email Address
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="client@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-4 pr-12 rounded-2xl border-slate-200 bg-white shadow-inner focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-400 group-hover:border-slate-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider ml-1 px-3 py-1 bg-slate-200/50 rounded-full w-fit">
              Attached: Invoice_${invoiceNumber}.pdf
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={sendEmailMutation.isPending}
              className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all order-2 sm:order-1">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendEmailMutation.isPending || !email}
              className="flex-[2] h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30 transition-all active:scale-95 order-1 sm:order-2">
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Deliver Invoice"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailInvoiceModal;
