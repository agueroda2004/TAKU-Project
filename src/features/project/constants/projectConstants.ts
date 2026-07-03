import type {
  ProjectPriority,
  ProjectStatus,
  TechCategory,
  RepoType,
} from "../project";

export const PROJECT_PRIORITIES: readonly ProjectPriority[] = [
  "baja",
  "media",
  "alta",
] as const;

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "idea",
  "planeacion",
  "desarrollo",
  "testing",
  "produccion",
  "mantenimiento",
] as const;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: "Idea",
  planeacion: "Planeación",
  desarrollo: "Desarrollo",
  testing: "Testing",
  produccion: "Producción",
  mantenimiento: "Mantenimiento",
};

export type ProjectStatusToneClasses = {
  pill: string;
  dot: string;
};

export const PROJECT_STATUS_TONES: Record<ProjectStatus, ProjectStatusToneClasses> = {
  idea: {
    pill: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
  planeacion: {
    pill: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
  },
  desarrollo: {
    pill: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  testing: {
    pill: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  produccion: {
    pill: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  mantenimiento: {
    pill: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
};

export type ProjectPriorityToneClasses = {
  pill: string;
  dot: string;
};

export const PROJECT_PRIORITY_TONES: Record<ProjectPriority, ProjectPriorityToneClasses> = {
  baja: {
    pill: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
  media: {
    pill: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  alta: {
    pill: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

export const TECH_CATEGORIES: readonly TechCategory[] = [
  "frontend",
  "backend",
  "database",
] as const;

export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Base de datos",
};

export const REPO_TYPES: readonly RepoType[] = ["frontend", "backend"] as const;

export const REPO_TYPE_LABELS: Record<RepoType, string> = {
  frontend: "Frontend",
  backend: "Backend",
};