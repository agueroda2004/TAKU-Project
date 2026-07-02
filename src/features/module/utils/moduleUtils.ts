import {
  MODULE_STATUSES,
  MODULE_STATUS_LABELS,
} from "../constants/moduleConstants";
import type {
  CreateModuleInput,
  Module,
  ModuleStatus,
} from "../module";

export function moduleToFormState(module: Module): CreateModuleInput {
  return {
    name: module.name,
    description: module.description ?? "",
    status: module.status,
    priority: module.priority,
    color: module.color,
    icon: module.icon,
  };
}

/**
 * Devuelve el siguiente estado en el flujo de trabajo del módulo,
 * o `null` si el actual ya es el último.
 *
 * Orden tomado de `MODULE_STATUSES`:
 *   idea → planificacion → desarrollo → testing → produccion → mantenimiento
 */
export function getNextStatus(
  current: ModuleStatus
): ModuleStatus | null {
  const idx = MODULE_STATUSES.indexOf(current);
  if (idx === -1 || idx === MODULE_STATUSES.length - 1) {
    return null;
  }
  return MODULE_STATUSES[idx + 1];
}

export function getStatusLabel(status: ModuleStatus): string {
  return MODULE_STATUS_LABELS[status];
}