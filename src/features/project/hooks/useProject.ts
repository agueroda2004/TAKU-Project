import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../services/projectService";
import type {
  CreateProjectInput,
  Project,
  ProjectFiltersState,
  ProjectListItem,
} from "../project";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFiltersState) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateProjectInput>({
    mutationFn: (input) => createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export interface UpdateProjectVariables {
  id: string;
  input: CreateProjectInput;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateProjectVariables>({
    mutationFn: ({ id, input }) => updateProject(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteProject(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useProjects(filters: ProjectFiltersState) {
  return useQuery<ProjectListItem[], Error>({
    queryKey: projectKeys.list(filters),
    queryFn: () => getProjects(filters),
  });
}

export function useProject(id: string | undefined) {
  return useQuery<Project, Error>({
    queryKey: id ? projectKeys.detail(id) : projectKeys.details(),
    queryFn: () => getProjectById(id as string),
    enabled: Boolean(id),
  });
}