"use client";

import { cn } from "@/lib/utils";

interface HtmlRendererProps {
  html: string;
  className?: string;
}

export function HtmlRenderer({ html, className }: HtmlRendererProps) {
  if (!html) return null;

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-slate-900",
        "ql-snow ql-editor", // To inherit some Quill basic styling
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
