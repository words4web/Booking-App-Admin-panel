"use client";

import { useEffect, useState, useRef } from "react";
import { Download, X, Printer, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/src/types/invoice.types";
import { InvoiceService } from "@/src/services/invoiceManager/invoice.service";

interface InvoicePDFModalProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}

export function InvoicePDFModal({
  invoice,
  open,
  onClose,
}: InvoicePDFModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchPdf = async () => {
      if (!open) return;
      setIsLoading(true);
      try {
        const responseData = await InvoiceService.previewPdf(invoice);
        const blob = new Blob([responseData], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (error) {
        console.error("Failed to fetch PDF preview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, invoice]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Preview_${invoice.invoiceNumber || "Draft"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl h-[95vh] flex flex-col p-0 rounded-2xl bg-white border-none shadow-2xl z-[100] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-8 py-4 border-b bg-slate-50 flex-none shrink-0 z-[110]">
          <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
            <div className="w-2.5 h-8 bg-slate-900 rounded-full" />
            Invoice Preview
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading || !pdfUrl}
              className="h-10 rounded-xl font-semibold px-5 border hover:bg-slate-50 transition-all text-sm text-slate-700">
              <Printer className="h-4 w-4 mr-2 text-slate-400" />
              Print
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading || !pdfUrl}
              className="h-10 rounded-xl font-semibold px-5 bg-slate-900 text-white hover:bg-slate-800 shadow-lg text-sm transition-all">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-slate-100 ml-2 text-slate-500">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-slate-100/50 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="font-semibold tracking-wide text-sm">
                Generating PDF...
              </p>
            </div>
          ) : pdfUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="w-full h-full rounded-xl shadow-xl border border-slate-200 bg-white"
              title="Invoice PDF Preview"
            />
          ) : (
            <div className="text-slate-400 font-semibold tracking-wide text-sm flex flex-col items-center">
              <span className="text-4xl mb-4">📄</span>
              Failed to load PDF preview
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
