import type { ModulePriority, ModuleStatus } from "../module";

export const MODULE_PRIORITIES: readonly ModulePriority[] = [
  "baja",
  "media",
  "alta",
] as const;

export const MODULE_PRIORITY_LABELS: Record<ModulePriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const MODULE_STATUSES: readonly ModuleStatus[] = [
  "idea",
  "planificacion",
  "desarrollo",
  "testing",
  "produccion",
  "mantenimiento",
] as const;

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  idea: "Idea",
  planificacion: "Planificación",
  desarrollo: "Desarrollo",
  testing: "Testing",
  produccion: "Producción",
  mantenimiento: "Mantenimiento",
};

export const MODULE_DEFAULT_PRIORITY: ModulePriority = "media";
export const MODULE_DEFAULT_STATUS: ModuleStatus = "idea";