"use client";

import { useState } from "react";
import { useAllCMSQuery, useUpsertCMSMutation } from "@/src/services/cmsManager/useCMSQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { Plus, Edit2, Layout } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICMSContent } from "@/src/types/cms.types";
import { CMSForm } from "@/src/components/forms/CMSForm";

export default function CMSManagementPage() {
  const { data: cmsList, isLoading } = useAllCMSQuery();
  const upsertMutation = useUpsertCMSMutation();

  const [selectedContent, setSelectedContent] = useState<ICMSContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (cms: ICMSContent) => {
    setSelectedContent(cms);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedContent(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedContent(null);
    setIsCreating(false);
  };

  const handleSubmit = (formData: any) => {
    upsertMutation.mutate(formData, {
      onSuccess: () => {
        handleCancel();
      },
    });
  };

  if (isLoading) return <CommonLoader />;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMS Management</h1>
          <p className="text-muted-foreground">
            Manage your application's dynamic content with a modular section-based editor.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="rounded-xl gap-2 h-12 px-6 shadow-md shadow-primary/10">
          <Plus className="h-4 w-4" />
          Create New Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List View */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                Existing Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-4 pb-4 space-y-2">
                  {cmsList?.map((cms) => (
                    <div
                      key={cms._id}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border group ${
                        selectedContent?._id === cms._id
                          ? "bg-primary/5 border-primary/20"
                          : "bg-slate-50 border-slate-100 hover:border-primary/20 hover:bg-white"
                      }`}
                      onClick={() => handleEdit(cms)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">
                            {cms.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            /{cms.slug}
                          </p>
                        </div>
                        <Edit2 className={`h-3.5 w-3.5 ${selectedContent?._id === cms._id ? 'text-primary' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Editor View */}
        <div className="lg:col-span-8">
          {(selectedContent || isCreating) ? (
            <CMSForm
              isEdit={!!selectedContent}
              initialData={selectedContent || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isPending={upsertMutation.isPending}
            />
          ) : (
            <Card className="h-[400px] border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400">
                <Layout className="h-12 w-12" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-lg font-bold text-slate-900">Get Started</h3>
                <p className="text-sm text-muted-foreground">
                  Select a page to edit or create a new one using the section-based form.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
