import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
} from "../constants/projectConstants";
import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "../project";

export function projectToFormState(project: Project): CreateProjectInput {
  return {
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    priority: project.priority,
    status: project.status,
    isFavorite: project.isFavorite,
    color: project.color,
    icon: project.icon,
    deploymentService: project.deploymentService,
    infrastructure: project.infrastructure,
    repositories: project.repositories,
    technologies: project.technologies,
    services: project.services,
  };
}

/**
 * Devuelve el siguiente estado en el flujo de trabajo del proyecto,
 * o `null` si el actual ya es el último.
 *
 * Orden tomado de `PROJECT_STATUSES`:
 *   idea → planeacion → desarrollo → testing → produccion → mantenimiento
 */
export function getNextStatus(
  current: ProjectStatus,
): ProjectStatus | null {
  const idx = PROJECT_STATUSES.indexOf(current);
  if (idx === -1 || idx === PROJECT_STATUSES.length - 1) {
    return null;
  }
  return PROJECT_STATUSES[idx + 1];
}

export function getStatusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_LABELS[status];
}
