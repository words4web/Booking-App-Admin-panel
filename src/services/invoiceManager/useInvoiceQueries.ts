import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InvoiceService } from "./invoice.service";
import { InvoiceFilters, InvoiceFormData } from "../../types/invoice.types";
import { toast } from "react-toastify";

export const useInvoicesQuery = (filters: InvoiceFilters = {}) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => InvoiceService.getAll(filters),
  });
};

export const useInvoiceDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => InvoiceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvoiceFormData) => InvoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    },
  });
};

export const useUpdateInvoiceMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<InvoiceFormData>) =>
      InvoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      toast.success("Invoice updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update invoice");
    },
  });
};

export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    },
  });
};

export const useToggleInvoicePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvoiceService.togglePaymentStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      toast.success("Invoice status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to toggle payment status",
      );
    },
  });
};
