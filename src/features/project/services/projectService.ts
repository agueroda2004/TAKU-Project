import { supabase } from "../../../config/supabase";
import type {
  CreateProjectInput,
  Project,
  ProjectFiltersState,
  ProjectListItem,
  ProjectRepository,
  ProjectServiceLink,
  ProjectTechnology,
  RepoType,
  TechCategory,
} from "../project";

type ProjectPayload = Omit<CreateProjectInput, never>;

export async function createProject(input: CreateProjectInput): Promise<void> {
  const payload: ProjectPayload = input;

  const { error } = await supabase.rpc("create_project", { payload });

  if (error) {
    throw error;
  }
}

export async function updateProject(
  id: string,
  input: CreateProjectInput
): Promise<void> {
  const payload: ProjectPayload = input;

  const { error } = await supabase.rpc("update_project", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  // Las FK de project_repositories, project_technologies y project_services
  // tienen ON DELETE CASCADE, así que borrar el proyecto borra sus relaciones
  // en una sola operación. RLS se encarga de que solo el dueño pueda borrar.
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getProjects(
  filters: ProjectFiltersState
): Promise<ProjectListItem[]> {
  let query = supabase
    .from("projects")
    .select("id, name, status, priority, is_favorite, description, color")
    .order("is_favorite", { ascending: false })
    .order("name", { ascending: true });

  const trimmedName = filters.name.trim();
  if (trimmedName) {
    query = query.ilike("name", `%${trimmedName}%`);
  }
  if (filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }
  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.favorite === "favorites") {
    query = query.eq("is_favorite", true);
  }
  if (filters.startDateFrom) {
    query = query.gte("start_date", filters.startDateFrom);
  }
  if (filters.startDateTo) {
    query = query.lte("start_date", filters.startDateTo);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    priority: row.priority,
    isFavorite: row.is_favorite,
    description: row.description,
    color: row.color,
  }));
}

interface ProjectRepositoryRow {
  type: RepoType;
  url: string;
}

interface ProjectTechnologyRow {
  category: TechCategory;
  technologies: { name: string } | null;
}

interface ProjectServiceRow {
  name: string;
  url: string | null;
}

interface ProjectDetailRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  priority: Project["priority"];
  status: Project["status"];
  is_favorite: boolean;
  color: string | null;
  icon: string | null;
  deployment_service: string | null;
  infrastructure: string | null;
  created_at: string;
  updated_at: string;
  project_repositories: ProjectRepositoryRow[] | null;
  project_technologies: ProjectTechnologyRow[] | null;
  project_services: ProjectServiceRow[] | null;
}

function mapProjectDetail(row: ProjectDetailRow): Project {
  const repositories: ProjectRepository[] = (row.project_repositories ?? []).map(
    (repo) => ({ type: repo.type, url: repo.url })
  );

  const technologies: ProjectTechnology[] = (row.project_technologies ?? [])
    .filter((tech) => tech.technologies !== null)
    .map((tech) => ({
      name: tech.technologies!.name,
      category: tech.category,
    }));

  const services: ProjectServiceLink[] = (row.project_services ?? []).map(
    (svc) => ({ name: svc.name, url: svc.url })
  );

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    priority: row.priority,
    status: row.status,
    isFavorite: row.is_favorite,
    color: row.color,
    icon: row.icon,
    deploymentService: row.deployment_service,
    infrastructure: row.infrastructure,
    repositories,
    technologies,
    services,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProjectById(id: string): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        user_id,
        name,
        description,
        start_date,
        end_date,
        priority,
        status,
        is_favorite,
        color,
        icon,
        deployment_service,
        infrastructure,
        created_at,
        updated_at,
        project_repositories(url, type),
        project_technologies(category, technologies(name)),
        project_services(name, url)
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Proyecto no encontrado.");
  }

  return mapProjectDetail(data as unknown as ProjectDetailRow);
}