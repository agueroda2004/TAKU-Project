import type { BugPriority, BugStatus } from "../bug";

export const BUG_PRIORITIES: readonly BugPriority[] = [
  "baja",
  "media",
  "alta",
] as const;

export const BUG_PRIORITY_LABELS: Record<BugPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const BUG_STATUSES: readonly BugStatus[] = [
  "abierto",
  "en_proceso",
  "resuelto",
  "cerrado",
] as const;

export const BUG_STATUS_LABELS: Record<BugStatus, string> = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

export const BUG_DEFAULT_PRIORITY: BugPriority = "media";
export const BUG_DEFAULT_STATUS: BugStatus = "abierto";

export type BugStatusToneClasses = {
  pill: string;
  dot: string;
};

export const BUG_STATUS_TONES: Record<BugStatus, BugStatusToneClasses> = {
  abierto: {
    pill: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  en_proceso: {
    pill: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  resuelto: {
    pill: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  cerrado: {
    pill: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
};

export type BugPriorityToneClasses = {
  pill: string;
  dot: string;
};

export const BUG_PRIORITY_TONES: Record<BugPriority, BugPriorityToneClasses> = {
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