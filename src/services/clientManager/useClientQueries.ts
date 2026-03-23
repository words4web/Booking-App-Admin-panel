import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientService } from "./client.service";
import {
  ClientFormData,
  ClientFilters,
  Client,
} from "../../types/client.types";
import { toast } from "react-toastify";

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (filters: ClientFilters) =>
    [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

export function useAllClientsQuery(
  filters: ClientFilters = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => ClientService.getAll(filters),
    ...options,
  });
}

export function useClientDetailsQuery(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => ClientService.getById(id),
    enabled: !!id,
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientFormData) => ClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Client created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create client");
    },
  });
}

export function useUpdateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
      ClientService.update(id, data),
    onSuccess: (data: Client) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(data._id) });
      toast.success("Client updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update client");
    },
  });
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Client deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete client");
    },
  });
}
