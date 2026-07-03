import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBug,
  deleteBug,
  getBugById,
  getBugs,
  updateBug,
  type GetBugsOptions,
} from "../services/bugService";
import type {
  Bug,
  BugListItem,
  CreateBugInput,
} from "../bug";

export const bugKeys = {
  all: ["bugs"] as const,
  lists: () => [...bugKeys.all, "list"] as const,
  list: (moduleId: string) => [...bugKeys.lists(), moduleId] as const,
  details: () => [...bugKeys.all, "detail"] as const,
  detail: (id: string) => [...bugKeys.details(), id] as const,
};

export interface CreateBugVariables {
  moduleId: string;
  input: CreateBugInput;
}

export function useCreateBug() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateBugVariables>({
    mutationFn: ({ moduleId, input }) => createBug(moduleId, input),
    onSuccess: (_data, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: bugKeys.list(moduleId) });
    },
  });
}

export interface UpdateBugVariables {
  id: string;
  moduleId: string;
  input: CreateBugInput;
}

export function useUpdateBug() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateBugVariables>({
    mutationFn: ({ id, input }) => updateBug(id, input),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: bugKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: bugKeys.detail(id) });
    },
  });
}

export interface DeleteBugVariables {
  id: string;
  moduleId: string;
}

export function useDeleteBug() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteBugVariables>({
    mutationFn: ({ id }) => deleteBug(id),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: bugKeys.list(moduleId) });
      queryClient.removeQueries({ queryKey: bugKeys.detail(id) });
    },
  });
}

export function useBugs(
  moduleId: string | undefined,
  options: GetBugsOptions = {},
) {
  return useQuery<BugListItem[], Error>({
    queryKey: moduleId
      ? [...bugKeys.list(moduleId), options]
      : bugKeys.lists(),
    queryFn: () => getBugs(moduleId as string, options),
    enabled: Boolean(moduleId),
  });
}

export function useBug(id: string | undefined) {
  return useQuery<Bug, Error>({
    queryKey: id ? bugKeys.detail(id) : bugKeys.details(),
    queryFn: () => getBugById(id as string),
    enabled: Boolean(id),
  });
}