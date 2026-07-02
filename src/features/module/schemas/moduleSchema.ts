import { z } from "zod";
import {
  MODULE_PRIORITIES,
  MODULE_STATUSES,
} from "../constants/moduleConstants";
import type {
  ModulePriority,
  ModuleStatus,
} from "../module";

export const moduleSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio." })
    .trim()
    .min(1, { error: "El nombre es obligatorio." })
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { error: "El nombre no puede tener más de 100 caracteres." }),

  description: z
    .string()
    .trim()
    .max(1000, { error: "La descripción no puede tener más de 1000 caracteres." }),

  status: z.enum(
    MODULE_STATUSES as unknown as [ModuleStatus, ...ModuleStatus[]]
  ),

  priority: z.enum(
    MODULE_PRIORITIES as unknown as [ModulePriority, ...ModulePriority[]]
  ),

  color: z.string().nullable(),

  icon: z.string().nullable(),
});

export type ModuleFormInput = z.input<typeof moduleSchema>;
export type ModuleFormOutput = z.output<typeof moduleSchema>;

export type ModuleFieldErrors = Partial<{
  name: string;
  description: string;
  status: string;
  priority: string;
}>;

export function formatModuleErrors(
  error: z.ZodError
): ModuleFieldErrors {
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