import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocumentation,
  deleteDocumentation,
  getDocumentationById,
  getDocumentations,
  updateDocumentation,
  type GetDocumentationsOptions,
} from "../services/documentationService";
import type {
  CreateDocumentationInput,
  Documentation,
  DocumentationListItem,
} from "../documentation";

export const documentationKeys = {
  all: ["documentations"] as const,
  lists: () => [...documentationKeys.all, "list"] as const,
  list: (moduleId: string) => [...documentationKeys.lists(), moduleId] as const,
  details: () => [...documentationKeys.all, "detail"] as const,
  detail: (id: string) => [...documentationKeys.details(), id] as const,
};

export interface CreateDocumentationVariables {
  moduleId: string;
  input: CreateDocumentationInput;
}

export function useCreateDocumentation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateDocumentationVariables>({
    mutationFn: ({ moduleId, input }) =>
      createDocumentation(moduleId, input),
    onSuccess: (_data, { moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: documentationKeys.list(moduleId),
      });
    },
  });
}

export interface UpdateDocumentationVariables {
  id: string;
  moduleId: string;
  input: CreateDocumentationInput;
}

export function useUpdateDocumentation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateDocumentationVariables>({
    mutationFn: ({ id, input }) => updateDocumentation(id, input),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: documentationKeys.list(moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: documentationKeys.detail(id),
      });
    },
  });
}

export interface DeleteDocumentationVariables {
  id: string;
  moduleId: string;
}

export function useDeleteDocumentation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteDocumentationVariables>({
    mutationFn: ({ id }) => deleteDocumentation(id),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: documentationKeys.list(moduleId),
      });
      queryClient.removeQueries({ queryKey: documentationKeys.detail(id) });
    },
  });
}

export function useDocumentations(
  moduleId: string | undefined,
  options: GetDocumentationsOptions = {}
) {
  return useQuery<DocumentationListItem[], Error>({
    queryKey: moduleId
      ? [...documentationKeys.list(moduleId), options]
      : documentationKeys.lists(),
    queryFn: () => getDocumentations(moduleId as string, options),
    enabled: Boolean(moduleId),
  });
}

export function useDocumentation(id: string | undefined) {
  return useQuery<Documentation, Error>({
    queryKey: id ? documentationKeys.detail(id) : documentationKeys.details(),
    queryFn: () => getDocumentationById(id as string),
    enabled: Boolean(id),
  });
}