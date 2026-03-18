import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CMSService } from "./cms.service";
import { toast } from "react-toastify";
import { IUpsertCMSRequest } from "../../types/cms.types";

export const cmsKeys = {
  all: ["cms"] as const,
  list: () => [...cmsKeys.all, "list"] as const,
  detail: (slug: string) => [...cmsKeys.all, "detail", slug] as const,
};

export function useAllCMSQuery() {
  return useQuery({
    queryKey: cmsKeys.list(),
    queryFn: () => CMSService.getAllContent(),
    select: (data) => data.data,
  });
}

export function useCMSDetailQuery(slug: string) {
  return useQuery({
    queryKey: cmsKeys.detail(slug),
    queryFn: () => CMSService.getContentBySlug(slug),
    select: (data) => data.data,
    enabled: !!slug,
  });
}

export function useUpsertCMSMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpsertCMSRequest) => CMSService.upsertContent(data),
    onSuccess: () => {
      toast.success("CMS content updated successfully!");
      queryClient.invalidateQueries({ queryKey: cmsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to update CMS content. Please try again.";
      toast.error(message);
    },
  });
}
