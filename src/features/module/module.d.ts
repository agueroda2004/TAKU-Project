export type ModulePriority = "baja" | "media" | "alta";

export type ModuleStatus =
  | "idea"
  | "planificacion"
  | "desarrollo"
  | "testing"
  | "produccion"
  | "mantenimiento";

export interface Module {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: ModuleStatus;
  priority: ModulePriority;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleInput {
  name: string;
  description?: string | null;
  status: ModuleStatus;
  priority: ModulePriority;
  color: string | null;
  icon: string | null;
}

export interface ModuleListItem {
  id: string;
  projectId: string;
  name: string;
  status: ModuleStatus;
  priority: ModulePriority;
  color: string | null;
  icon: string | null;
  description: string | null;
  progress: number;
}

export interface ModuleFilters {
  projectId: string;
  name?: string;
  priority?: ModulePriority | "all";
  status?: ModuleStatus | "all";
  progressMin?: number;
  progressMax?: number;
}