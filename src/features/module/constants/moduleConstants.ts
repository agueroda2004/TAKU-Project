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

export type ModuleStatusToneClasses = {
  pill: string;
  dot: string;
};

export const MODULE_STATUS_TONES: Record<ModuleStatus, ModuleStatusToneClasses> = {
  idea: {
    pill: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
  planificacion: {
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

export type ModulePriorityToneClasses = {
  pill: string;
  dot: string;
};

export const MODULE_PRIORITY_TONES: Record<ModulePriority, ModulePriorityToneClasses> = {
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

export const MODULE_DEFAULT_PRIORITY: ModulePriority = "media";
export const MODULE_DEFAULT_STATUS: ModuleStatus = "idea";