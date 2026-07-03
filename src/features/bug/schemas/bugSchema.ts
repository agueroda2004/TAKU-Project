import { z } from "zod";
import {
  BUG_PRIORITIES,
  BUG_STATUSES,
} from "../constants/bugConstants";
import type { BugPriority, BugStatus } from "../bug";

export const bugSchema = z.object({
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

  status: z.enum(BUG_STATUSES as unknown as [BugStatus, ...BugStatus[]]),

  priority: z.enum(BUG_PRIORITIES as unknown as [BugPriority, ...BugPriority[]]),
});

export type BugFormInput = z.input<typeof bugSchema>;
export type BugFormOutput = z.output<typeof bugSchema>;

export type BugFieldErrors = Partial<{
  name: string;
  description: string;
  status: string;
  priority: string;
}>;

export function formatBugErrors(error: z.ZodError): BugFieldErrors {
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