"use client";

import { useFormik, FieldArray, FormikProvider } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { CMSSchema } from "@/src/schemas/validationSchemas";
import { IUpsertCMSRequest } from "@/src/types/cms.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Save, Plus, Trash2, Layout } from "lucide-react";
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
      sections: [{ title: "", content: "" }],
    },
    validationSchema: toFormikValidationSchema(CMSSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getFieldError = (name: string) => {
    // Helper to get nested field errors (e.g., sections.0.title)
    const parts = name.split('.');
    let error: any = formik.errors;
    let touched: any = formik.touched;
    
    for (const part of parts) {
      error = error?.[part];
      touched = touched?.[part];
    }
    
    return touched && error ? error : null;
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {isEdit ? "Edit Page" : "Create Page"}
                </CardTitle>
                <CardDescription>
                  Configure your page details and dynamic sections.
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
            <div className="grid grid-cols-2 gap-4 p-4 rounded-3xl bg-slate-50/50 border border-slate-100 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Slug (URL)</label>
                <Input
                  disabled={isEdit}
                  placeholder="e.g. privacy-policy"
                  {...formik.getFieldProps("slug")}
                  className={cn(
                    "rounded-xl bg-white border-slate-200 transition-all",
                    getFieldError("slug") && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {getFieldError("slug") && <p className="text-destructive text-[10px] font-bold uppercase ml-2">{getFieldError("slug")}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Main Title</label>
                <Input
                  placeholder="e.g. Terms of Service"
                  {...formik.getFieldProps("title")}
                  className={cn(
                    "rounded-xl bg-white border-slate-200 transition-all",
                    getFieldError("title") && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {getFieldError("title") && <p className="text-destructive text-[10px] font-bold uppercase ml-2">{getFieldError("title")}</p>}
              </div>
            </div>

            <div className="space-y-4 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" />
                Content Sections
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const sections = [...formik.values.sections, { title: "", content: "" }];
                  formik.setFieldValue("sections", sections);
                }}
                className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            <FieldArray
              name="sections"
              render={(arrayHelpers) => (
                <div className="space-y-6">
                  {formik.values.sections.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4 group transition-all",
                        getFieldError(`sections.${index}`) && "border-destructive/20 bg-destructive/[0.01]"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Section #{index + 1}
                        </label>
                        {formik.values.sections.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => arrayHelpers.remove(index)}
                            className="text-slate-300 hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="Section Title"
                          {...formik.getFieldProps(`sections.${index}.title`)}
                          className={cn(
                            "text-lg font-bold border-none bg-slate-50 focus:bg-white rounded-xl px-4 py-6 transition-all",
                            getFieldError(`sections.${index}.title`) && "bg-destructive/5 placeholder:text-destructive/40"
                          )}
                        />
                        {getFieldError(`sections.${index}.title`) && (
                          <p className="text-destructive text-[10px] font-bold uppercase ml-4">
                            {getFieldError(`sections.${index}.title`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Write section content here..."
                          {...formik.getFieldProps(`sections.${index}.content`)}
                          className={cn(
                            "min-h-[150px] border-none bg-slate-50 focus:bg-white rounded-2xl p-4 resize-none transition-all",
                            getFieldError(`sections.${index}.content`) && "bg-destructive/5 placeholder:text-destructive/40"
                          )}
                        />
                        {getFieldError(`sections.${index}.content`) && (
                          <p className="text-destructive text-[10px] font-bold uppercase ml-4">
                            {getFieldError(`sections.${index}.content`)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />

            <div className="flex justify-end gap-3 pt-10 mt-8 border-t border-slate-100">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 px-10 rounded-2xl font-bold text-sm uppercase tracking-wider gap-2 shadow-lg shadow-primary/20"
              >
                {isPending ? "Saving Changes..." : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? "Update Page" : "Publish Page"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormikProvider>
  );
}
