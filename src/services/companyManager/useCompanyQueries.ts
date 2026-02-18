import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "./company.service";
import { toast } from "react-toastify";
import { CompanyFormData } from "@/src/types/forms.types";

// Query Keys
export const companyKeys = {
  all: ["companies"] as const,
  list: (page: number, limit: number) =>
    [...companyKeys.all, "list", { page, limit }] as const,
  detail: (id: string) => [...companyKeys.all, "detail", id] as const,
};

export function useAllCompaniesQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: companyKeys.list(page, limit),
    queryFn: () => CompanyService.getAllCompanies(page, limit),
    select: (data) => data.data.companies,
  });
}

export function useCompanyDetailsQuery(companyId: string) {
  return useQuery({
    queryKey: companyKeys.detail(companyId),
    queryFn: () => CompanyService.getCompanyById(companyId),
    select: (data) => data.data.company,
    enabled: !!companyId,
  });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyFormData) => CompanyService.createCompany(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Company created successfully!");
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to create company. Please try again.";
      toast.error(message);
    },
  });
}

export function useUpdateCompanyMutation(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CompanyFormData>) =>
      CompanyService.updateCompany(companyId, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Company updated successfully!");
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(companyId),
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to update company. Please try again.";
      toast.error(message);
    },
  });
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => CompanyService.deleteCompany(companyId),
    onSuccess: (data) => {
      toast.success(data?.message || "Company deleted successfully!");
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete company. Please try again.";
      toast.error(message);
    },
  });
}
