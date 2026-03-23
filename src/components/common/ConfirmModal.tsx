"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "destructive" | "primary" | "warning";
  icon?: LucideIcon;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "destructive",
  icon: Icon = AlertTriangle,
  isLoading,
}: ConfirmModalProps) {
  const variantStyles = {
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  const buttonVariants = {
    destructive: "destructive",
    primary: "default",
    warning: "secondary",
  } as const;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[540px] rounded-2xl sm:rounded-[3rem] px-5 py-6 sm:px-10 sm:py-8 border-none shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div
            className={cn(
              "h-16 w-16 rounded-[1.5rem] border-2 flex items-center justify-center shadow-inner transition-transform duration-500 animate-in zoom-in-50",
              variantStyles[variant],
            )}>
            <Icon className="h-10 w-10" />
          </div>

          <div className="space-y-2 max-w-[460px] mx-auto">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-wider text-xs border-2 border-slate-200">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            variant={buttonVariants[variant]}
            className={cn(
              "flex-1 h-14 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all border-2",
              variant === "destructive"
                ? "border-destructive/20"
                : "border-primary/20",
            )}
            onClick={onConfirm}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
