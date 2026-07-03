import { z } from "zod";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../constants/taskConstants";
import type { TaskPriority, TaskStatus } from "../task";

export const taskSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio." })
    .trim()
    .min(1, { error: "El nombre es obligatorio." })
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .max(200, { error: "El nombre no puede tener más de 200 caracteres." }),

  description: z
    .string()
    .trim()
    .max(2000, {
      error: "La descripción no puede tener más de 2000 caracteres.",
    }),

  status: z.enum(
    TASK_STATUSES as unknown as [TaskStatus, ...TaskStatus[]],
  ),

  priority: z.enum(
    TASK_PRIORITIES as unknown as [TaskPriority, ...TaskPriority[]],
  ),
});

export type TaskFormInput = z.input<typeof taskSchema>;
export type TaskFormOutput = z.output<typeof taskSchema>;

export type TaskFieldErrors = Partial<{
  name: string;
  description: string;
  status: string;
  priority: string;
}>;

export function formatTaskErrors(error: z.ZodError): TaskFieldErrors {
  const { fieldErrors } = z.flattenError(error) as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  return {
    name: fieldErrors.name?.[0],
    description: fieldErrors.description?.[0],
    status: fieldErrors.status?.[0],
    priority: fieldErrors.priority?.[0],
  };
}
