"use client";

import { cn } from "@/lib/utils";
import "react-quill-new/dist/quill.snow.css";

interface HtmlRendererProps {
  html: string;
  className?: string;
}

export function HtmlRenderer({ html, className }: HtmlRendererProps) {
  if (!html) return null;

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none text-slate-600 leading-[1.6] transition-all",
        "prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter",
        "prose-p:my-4 first:prose-p:mt-0 last:prose-p:mb-0",
        "prose-li:my-1",
        "prose-strong:text-slate-900",
        "ql-snow ql-editor !p-0 !h-auto !min-h-0", // Import Quill's editor class but reset padding/height
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
