"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Skeleton } from "@/components/ui/skeleton";

const QuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-[2rem]" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "color",
  "background",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  return (
    <div className={className}>
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-full min-h-[400px] bg-white rounded-[2rem] overflow-hidden border border-slate-200"
      />
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          color: #334155 !important;
          min-h: 350px;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background: #f8fafc !important;
          padding: 1rem !important;
          border-top-left-radius: 2rem !important;
          border-top-right-radius: 2rem !important;
        }
        .ql-editor {
          min-height: 350px !important;
          padding: 1.5rem !important;
          line-height: 1.625 !important;
        }
        .ql-editor.ql-blank::before {
          left: 1.5rem !important;
          color: #94a3b8 !important;
          font-style: normal !important;
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before {
          content: 'Normal';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
          content: 'Heading 1';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
          content: 'Heading 2';
        }
        .ql-snow .ql-stroke {
          stroke: #64748b !important;
        }
        .ql-snow .ql-fill {
          fill: #64748b !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #3c0a50 !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #3c0a50 !important;
        }
      `}</style>
    </div>
  );
}
