import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle, ZoomIn, X } from "lucide-react";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { ReasonModal } from "@/src/components/common/ReasonModal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DocumentViewerProps {
  title: string;
  imageUrl: string | null;
  isVerified: boolean;
  reason: string | null;
  onVerify: (isVerified: boolean, reason?: string) => Promise<void>;
}

export function DocumentViewer({
  title,
  imageUrl,
  isVerified,
  reason,
  onVerify,
}: DocumentViewerProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine status for display
  let status: "missing" | "pending" | "verified" | "rejected" = "missing";
  if (imageUrl) {
    if (isVerified) status = "verified";
    else if (reason) status = "rejected";
    else status = "pending";
  } else if (reason) {
    status = "rejected"; // Image was deleted upon rejection
  }

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onVerify(true);
      setIsConfirmModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (rejectionReason: string) => {
    setLoading(true);
    try {
      await onVerify(false, rejectionReason);
      setIsReasonModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group bg-white rounded-3xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Document Status
          </p>
        </div>
        <div>
          {status === "verified" && (
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
              <CheckCircle className="w-3 h-3 mr-1.5" /> Verified
            </Badge>
          )}
          {status === "rejected" && (
            <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
              <XCircle className="w-3 h-3 mr-1.5" /> Rejected
            </Badge>
          )}
          {status === "pending" && (
            <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
              <AlertCircle className="w-3 h-3 mr-1.5" /> Pending
            </Badge>
          )}
          {status === "missing" && (
            <Badge className="bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-50 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
              {"—"} Missing
            </Badge>
          )}
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-100 transition-all duration-500 group-hover:border-primary/20">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
              <Button
                variant="secondary"
                className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6 shadow-xl"
                onClick={() => setIsLightboxOpen(true)}>
                <ZoomIn className="mr-2 h-4 w-4" /> Expand View
              </Button>
            </div>
          </>
        ) : (
          <div className="text-slate-300 flex flex-col items-center space-y-3">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <AlertCircle className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              Upload Required
            </span>
          </div>
        )}
      </div>

      {status === "rejected" && reason && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">
            Rejection Reason
          </p>
          <p className="text-sm font-medium text-rose-700 leading-relaxed">
            {reason}
          </p>
        </div>
      )}

      {status !== "verified" && status !== "missing" && reason == null && (
        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]  transition-all active:scale-95"
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={loading}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>

          <Button
            variant="outline"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
            onClick={() => setIsReasonModalOpen(true)}
            disabled={loading}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title="Approve Document"
        description={`By clicking approve, you confirm that the ${title} is valid and readable. This action cannot be undone.`}
        confirmText="Yes, Approve"
        onConfirm={handleApprove}
        variant="primary"
        icon={CheckCircle}
        isLoading={loading}
      />

      <ReasonModal
        isOpen={isReasonModalOpen}
        onOpenChange={setIsReasonModalOpen}
        onSubmit={handleReject}
        title="Reject Document"
        description="Please provide a clear reason for rejection. This helps the driver understand what to re-upload."
        placeholder="e.g. Image blurry, Expired document, Mismatched name"
        loading={loading}
      />

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] p-0 bg-black/80 border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-none"
              onClick={() => setIsLightboxOpen(false)}>
              <X className="h-5 w-5" />
            </Button>

            {imageUrl && (
              <div className="relative w-full aspect-auto min-h-[50vh] flex items-center justify-center p-4">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  // width={1400}
                  // height={900}
                  className="object-contain rounded-3xl"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
