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