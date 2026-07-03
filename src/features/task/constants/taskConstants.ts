import type { TaskPriority, TaskStatus } from "../task";

export const TASK_PRIORITIES: readonly TaskPriority[] = [
  "baja",
  "media",
  "alta",
] as const;

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const TASK_STATUSES: readonly TaskStatus[] = [
  "pendiente",
  "en_proceso",
  "terminada",
] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  terminada: "Terminada",
};

export const TASK_DEFAULT_PRIORITY: TaskPriority = "media";
export const TASK_DEFAULT_STATUS: TaskStatus = "pendiente";

export type TaskStatusToneClasses = {
  pill: string;
  dot: string;
};

export const TASK_STATUS_TONES: Record<TaskStatus, TaskStatusToneClasses> = {
  pendiente: {
    pill: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
  en_proceso: {
    pill: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  terminada: {
    pill: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
};

export type TaskPriorityToneClasses = {
  pill: string;
  dot: string;
};

export const TASK_PRIORITY_TONES: Record<TaskPriority, TaskPriorityToneClasses> = {
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