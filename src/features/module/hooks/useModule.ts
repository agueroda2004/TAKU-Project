import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
  type GetModulesOptions,
} from "../services/moduleService";
import type {
  CreateModuleInput,
  Module,
  ModuleListItem,
} from "../module";

export const moduleKeys = {
  all: ["modules"] as const,
  lists: () => [...moduleKeys.all, "list"] as const,
  list: (projectId: string) => [...moduleKeys.lists(), projectId] as const,
  details: () => [...moduleKeys.all, "detail"] as const,
  detail: (id: string) => [...moduleKeys.details(), id] as const,
};

export interface CreateModuleVariables {
  projectId: string;
  input: CreateModuleInput;
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateModuleVariables>({
    mutationFn: ({ projectId, input }) => createModule(projectId, input),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
    },
  });
}

export interface UpdateModuleVariables {
  id: string;
  projectId: string;
  input: CreateModuleInput;
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateModuleVariables>({
    mutationFn: ({ id, input }) => updateModule(id, input),
    onSuccess: (_data, { id, projectId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: moduleKeys.detail(id) });
    },
  });
}

export interface DeleteModuleVariables {
  id: string;
  projectId: string;
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteModuleVariables>({
    mutationFn: ({ id }) => deleteModule(id),
    onSuccess: (_data, { id, projectId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
      queryClient.removeQueries({ queryKey: moduleKeys.detail(id) });
    },
  });
}

export function useModules(
  projectId: string | undefined,
  options: GetModulesOptions = {}
) {
  return useQuery<ModuleListItem[], Error>({
    queryKey: projectId
      ? [...moduleKeys.list(projectId), options]
      : moduleKeys.lists(),
    queryFn: () => getModules(projectId as string, options),
    enabled: Boolean(projectId),
  });
}

export function useModule(id: string | undefined) {
  return useQuery<Module, Error>({
    queryKey: id ? moduleKeys.detail(id) : moduleKeys.details(),
    queryFn: () => getModuleById(id as string),
    enabled: Boolean(id),
  });
}