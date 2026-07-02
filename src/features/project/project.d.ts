export type ProjectPriority = "baja" | "media" | "alta";

export type ProjectStatus =
  | "idea"
  | "planeacion"
  | "desarrollo"
  | "testing"
  | "produccion"
  | "mantenimiento";

export type TechCategory = "frontend" | "backend" | "database";

export type RepoType = "frontend" | "backend";

export interface ProjectTechnology {
  name: string;
  category: TechCategory;
}

export interface ProjectRepository {
  type: RepoType;
  url: string;
}

export interface ProjectServiceLink {
  name: string;
  url: string | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  priority: ProjectPriority;
  status: ProjectStatus;
  isFavorite: boolean;
  color: string | null;
  icon: string | null;
  deploymentService: string | null;
  infrastructure: string | null;
  repositories: ProjectRepository[];
  technologies: ProjectTechnology[];
  services: ProjectServiceLink[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  priority: ProjectPriority;
  status: ProjectStatus;
  isFavorite?: boolean;
  color?: string | null;
  icon?: string | null;
  deploymentService?: string | null;
  infrastructure?: string | null;
  repositories?: ProjectRepository[];
  technologies?: ProjectTechnology[];
  services?: ProjectServiceLink[];
}

export interface ProjectListItem {
  id: string;
  name: string;
  status: ProjectStatus;
  isFavorite: boolean;
  description: string | null;
  color: string | null;
}

export type ProjectPriorityFilter = ProjectPriority | "all";
export type ProjectStatusFilter = ProjectStatus | "all";
export type ProjectFavoriteFilter = "all" | "favorites";

export interface ProjectFiltersState {
  name: string;
  priority: ProjectPriorityFilter;
  status: ProjectStatusFilter;
  favorite: ProjectFavoriteFilter;
  startDateFrom: string;
  startDateTo: string;
}