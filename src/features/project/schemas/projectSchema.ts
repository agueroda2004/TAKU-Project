import { z } from "zod";
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  TECH_CATEGORIES,
  REPO_TYPES,
} from "../constants/projectConstants";
import type {
  ProjectPriority,
  ProjectStatus,
  TechCategory,
  RepoType,
} from "../project";

const repoUrlField = z
  .string()
  .trim()
  .max(500, { error: "URL demasiado larga." });

const optionalText = z
  .string()
  .trim()
  .max(2000, { error: "Texto demasiado largo." });

const priorityEnum = z.enum(
  PROJECT_PRIORITIES as unknown as [ProjectPriority, ...ProjectPriority[]]
);

const statusEnum = z.enum(
  PROJECT_STATUSES as unknown as [ProjectStatus, ...ProjectStatus[]]
);

const techCategoryEnum = z.enum(
  TECH_CATEGORIES as unknown as [TechCategory, ...TechCategory[]]
);

const repoTypeEnum = z.enum(
  REPO_TYPES as unknown as [RepoType, ...RepoType[]]
);

export const projectSchema = z
  .object({
    name: z
      .string({ error: "El nombre es obligatorio." })
      .trim()
      .min(1, { error: "El nombre es obligatorio." })
      .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
      .max(100, { error: "El nombre no puede tener más de 100 caracteres." }),

    description: z
      .string()
      .trim()
      .max(
        1000,
        { error: "La descripción no puede tener más de 1000 caracteres." }
      ),

    startDate: z
      .string({ error: "La fecha de inicio es obligatoria." })
      .min(1, { error: "La fecha de inicio es obligatoria." })
      .refine(
        (v) => !Number.isNaN(Date.parse(v)),
        "Fecha de inicio inválida."
      ),

    endDate: z.string().refine(
      (v) => v === "" || !Number.isNaN(Date.parse(v)),
      "Fecha de fin inválida."
    ),

    priority: priorityEnum,

    status: statusEnum,

    isFavorite: z.boolean(),

    color: z.string().nullable(),

    icon: z.string().nullable(),

    deploymentService: z
      .string()
      .trim()
      .max(100, { error: "Máximo 100 caracteres." }),

    infrastructure: optionalText,

    repositories: z
      .object({
        type: repoTypeEnum,
        url: repoUrlField,
      })
      .array(),

    technologies: z
      .object({
        name: z.string().trim().min(1).max(60),
        category: techCategoryEnum,
      })
      .array(),

    services: z
      .object({
        name: z.string().trim().min(1).max(60),
        url: z.string().trim().max(500),
      })
      .array(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return Date.parse(data.endDate) >= Date.parse(data.startDate);
    },
    {
      message: "La fecha de fin no puede ser anterior a la fecha de inicio.",
      path: ["endDate"],
    }
  );

export type ProjectFormInput = z.input<typeof projectSchema>;
export type ProjectFormOutput = z.output<typeof projectSchema>;

export type ProjectFieldErrors = Partial<{
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  deploymentService: string;
  infrastructure: string;
}>;

export function formatProjectErrors(error: z.ZodError): ProjectFieldErrors {
  const { fieldErrors } = z.flattenError(error) as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  return {
    name: fieldErrors.name?.[0],
    description: fieldErrors.description?.[0],
    startDate: fieldErrors.startDate?.[0],
    endDate: fieldErrors.endDate?.[0],
    priority: fieldErrors.priority?.[0],
    status: fieldErrors.status?.[0],
    deploymentService: fieldErrors.deploymentService?.[0],
    infrastructure: fieldErrors.infrastructure?.[0],
  };
}