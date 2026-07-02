import { supabase } from "../../../config/supabase";
import type {
  CreateModuleInput,
  Module,
  ModuleListItem,
} from "../module";

type ModulePayload = Omit<CreateModuleInput, never>;

export async function createModule(
  projectId: string,
  input: CreateModuleInput
): Promise<void> {
  const payload: ModulePayload = input;

  const { error } = await supabase.rpc("create_module", {
    p_project_id: projectId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateModule(
  id: string,
  input: CreateModuleInput
): Promise<void> {
  const payload: ModulePayload = input;

  const { error } = await supabase.rpc("update_module", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteModule(id: string): Promise<void> {
  // RLS se encarga del ownership. Las tareas que se agreguen en el futuro
  // deberían tener ON DELETE CASCADE hacia modules para borrarse solas.
  const { error } = await supabase.from("modules").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getModuleById(id: string): Promise<Module> {
  const { data, error } = await supabase
    .from("modules")
    .select(
      "id, project_id, name, description, status, priority, color, icon, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Módulo no encontrado.");
  }

  return {
    id: data.id,
    projectId: data.project_id,
    name: data.name,
    description: data.description,
    status: data.status,
    priority: data.priority,
    color: data.color,
    icon: data.icon,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export interface GetModulesOptions {
  limit?: number;
}

export async function getModules(
  projectId: string,
  options: GetModulesOptions = {}
): Promise<ModuleListItem[]> {
  let query = supabase
    .from("modules")
    .select(
      "id, project_id, name, status, priority, color, icon, description"
    )
    .eq("project_id", projectId)
    .order("priority", { ascending: false })
    .order("name", { ascending: true });

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    status: row.status,
    priority: row.priority,
    color: row.color,
    icon: row.icon,
    description: row.description,
    // TODO: calcular desde tasks cuando exista esa feature
    progress: 0,
  }));
}