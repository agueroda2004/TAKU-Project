import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubtask,
  createTask,
  deleteSubtask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubtask,
  updateTask,
  type GetTasksOptions,
} from "../services/taskService";
import type {
  CreateSubtaskInput,
  CreateTaskInput,
  TaskListItem,
  TaskWithSubtasks,
  UpdateSubtaskInput,
} from "../task";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (moduleId: string) => [...taskKeys.lists(), moduleId] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export interface CreateTaskVariables {
  moduleId: string;
  input: CreateTaskInput;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateTaskVariables>({
    mutationFn: ({ moduleId, input }) => createTask(moduleId, input),
    onSuccess: (_data, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(moduleId) });
    },
  });
}

export interface UpdateTaskVariables {
  id: string;
  moduleId: string;
  input: CreateTaskInput;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskVariables>({
    mutationFn: ({ id, input }) => updateTask(id, input),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

export interface DeleteTaskVariables {
  id: string;
  moduleId: string;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTaskVariables>({
    mutationFn: ({ id }) => deleteTask(id),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(moduleId) });
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

export function useTasks(
  moduleId: string | undefined,
  options: GetTasksOptions = {},
) {
  return useQuery<TaskListItem[], Error>({
    queryKey: moduleId
      ? [...taskKeys.list(moduleId), options]
      : taskKeys.lists(),
    queryFn: () => getTasks(moduleId as string, options),
    enabled: Boolean(moduleId),
  });
}

export function useTask(id: string | undefined) {
  return useQuery<TaskWithSubtasks, Error>({
    queryKey: id ? taskKeys.detail(id) : taskKeys.details(),
    queryFn: () => getTaskById(id as string),
    enabled: Boolean(id),
  });
}

export interface CreateSubtaskVariables {
  taskId: string;
  input: CreateSubtaskInput;
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateSubtaskVariables>({
    mutationFn: ({ taskId, input }) => createSubtask(taskId, input),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}

export interface UpdateSubtaskVariables {
  id: string;
  taskId: string;
  input: UpdateSubtaskInput;
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateSubtaskVariables>({
    mutationFn: ({ id, input }) => updateSubtask(id, input),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}

export interface DeleteSubtaskVariables {
  id: string;
  taskId: string;
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSubtaskVariables>({
    mutationFn: ({ id }) => deleteSubtask(id),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
