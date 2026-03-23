"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReasonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  title: string;
  description: string;
  placeholder?: string;
  loading?: boolean;
}

export function ReasonModal({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  description,
  placeholder = "Enter reason here...",
  loading = false,
}: ReasonModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[540px] rounded-2xl sm:rounded-[3rem] px-5 py-6 sm:px-10 sm:py-8 border-none shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl">
        <DialogHeader className="space-y-4">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Textarea
            placeholder={placeholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[150px] rounded-2xl border-2 border-slate-100 focus:border-primary/20 focus:ring-primary/10 transition-all resize-none p-4 font-medium"
          />
        </div>

        <DialogFooter className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-wider text-xs border-2 border-slate-200"
            disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all border-2 border-primary/20"
            onClick={handleSubmit}
            disabled={!reason.trim() || loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
