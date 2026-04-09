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
import { Link2, Loader2, Mail, Phone } from "lucide-react";
import { useSendPaymentLinkMutation } from "@/src/services/invoiceManager/useInvoiceQueries";

interface SendPaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  defaultEmail: string;
  defaultPhone: string;
}

const SendPaymentLinkModal: React.FC<SendPaymentLinkModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  defaultEmail,
  defaultPhone,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [paymentUrl, setPaymentUrl] = useState("");

  const sendPaymentLinkMutation = useSendPaymentLinkMutation();

  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
      setPhoneNumber(defaultPhone);
      setPaymentUrl("");
    }
  }, [defaultEmail, defaultPhone, isOpen]);

  const handleSend = () => {
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedUrl = paymentUrl.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || !trimmedUrl) {
      return;
    }

    sendPaymentLinkMutation.mutate(
      {
        id: invoiceId,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        paymentUrl: trimmedUrl,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      email.trim() &&
      emailRegex.test(email.trim()) &&
      paymentUrl.trim().length > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:max-w-[450px] p-0 overflow-hidden border border-slate-200 shadow-xl bg-white z-[100] rounded-xl sm:rounded-2xl">
        <DialogHeader className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-slate-600" />
            Send Payment Link
          </DialogTitle>
          <p className="text-slate-500 text-sm font-normal mt-1">
            Request payment for Invoice #{invoiceNumber} via email and SMS.
          </p>
        </DialogHeader>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Client Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="client@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-3 pr-10 rounded-lg border-slate-200 bg-white focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-slate-900"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Client Phone Number (SMS)
            </Label>
            <div className="relative group">
              <Input
                id="phone"
                type="tel"
                placeholder="+44 7700 900000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-10 pl-3 pr-10 rounded-lg border-slate-200 bg-white focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-slate-900"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Payment URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <Input
                id="url"
                type="url"
                placeholder="https://pay.stripe.com/..."
                value={paymentUrl}
                onChange={(e) => setPaymentUrl(e.target.value)}
                className="h-10 pl-3 pr-10 rounded-lg border-slate-200 bg-white focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-slate-900"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Link2 className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={sendPaymentLinkMutation.isPending}
              className="flex-1 h-10 rounded-lg text-slate-500 font-medium hover:bg-slate-100 transition-all order-2 sm:order-1">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendPaymentLinkMutation.isPending || !isFormValid()}
              className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all active:scale-[0.98] order-1 sm:order-2">
              {sendPaymentLinkMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Link"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendPaymentLinkModal;
