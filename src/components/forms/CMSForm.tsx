"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { CMSSchema } from "@/src/schemas/validationSchemas";
import { IUpsertCMSRequest } from "@/src/types/cms.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "./RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Save, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface CMSFormProps {
  initialData?: IUpsertCMSRequest;
  onSubmit: (data: IUpsertCMSRequest) => void;
  isPending?: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

export function CMSForm({
  initialData,
  onSubmit,
  isPending = false,
  onCancel,
  isEdit = false,
}: CMSFormProps) {
  const formik = useFormik<IUpsertCMSRequest>({
    initialValues: initialData || {
      slug: "",
      title: "",
      content: "",
    },
    validationSchema: toFormikValidationSchema(CMSSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getFieldError = (name: string) => {
    return formik.touched[name as keyof IUpsertCMSRequest] && formik.errors[name as keyof IUpsertCMSRequest]
      ? (formik.errors[name as keyof IUpsertCMSRequest] as string)
      : null;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {isEdit ? "Edit Page Content" : "Create Page"}
              </CardTitle>
              <CardDescription>
                Update the main title and text content for this page.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Page Title</label>
              <Input
                placeholder="e.g. Privacy Policy"
                {...formik.getFieldProps("title")}
                className={cn(
                  "h-14 rounded-2xl bg-white border-slate-200 transition-all text-lg font-bold",
                  getFieldError("title") && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {getFieldError("title") && <p className="text-destructive text-[10px] font-bold uppercase ml-2">{getFieldError("title")}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" />
                Page Content
              </label>
              <div className={cn(
                "rounded-[2rem] overflow-hidden border transition-all",
                getFieldError("content") ? "border-destructive" : "border-slate-100"
              )}>
                <RichTextEditor
                  value={formik.values.content || ""}
                  onChange={(content) => formik.setFieldValue("content", content)}
                  placeholder="Enter the page content here..."
                />
              </div>
              {getFieldError("content") && (
                <p className="text-destructive text-[10px] font-bold uppercase ml-4">
                  {getFieldError("content")}
                </p>
              )}
            </div>

            {/* Hidden Slug Field as it's required for the schema but handled automatically */}
            <input type="hidden" {...formik.getFieldProps("slug")} />
          </div>

          <div className="flex justify-end gap-3 pt-10 mt-8 border-t border-slate-100">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 px-10 rounded-2xl font-bold text-sm uppercase tracking-wider gap-2 shadow-lg shadow-primary/20"
            >
              {isPending ? "Saving..." : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
