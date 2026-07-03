import { supabase } from "../../../config/supabase";
import type {
  Bug,
  BugListItem,
  CreateBugInput,
} from "../bug";

type BugPayload = Omit<CreateBugInput, never>;

export async function createBug(
  moduleId: string,
  input: CreateBugInput,
): Promise<void> {
  const payload: BugPayload = input;

  const { error } = await supabase.rpc("create_bug", {
    p_module_id: moduleId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateBug(
  id: string,
  input: CreateBugInput,
): Promise<void> {
  const payload: BugPayload = input;

  const { error } = await supabase.rpc("update_bug", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteBug(id: string): Promise<void> {
  // RLS se encarga del ownership. No hay tablas hijas todavía; si en el
  // futuro se agregan (comentarios, adjuntos, etc.) deberían tener
  // ON DELETE CASCADE hacia bugs para borrarse solas.
  const { error } = await supabase.from("bugs").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

interface BugDetailRow {
  id: string;
  module_id: string;
  name: string;
  description: string | null;
  status: Bug["status"];
  priority: Bug["priority"];
  created_at: string;
  updated_at: string;
}

function mapBugDetail(row: BugDetailRow): Bug {
  return {
    id: row.id,
    moduleId: row.module_id,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBugById(id: string): Promise<Bug> {
  const { data, error } = await supabase
    .from("bugs")
    .select(
      "id, module_id, name, description, status, priority, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Bug no encontrado.");
  }

  return mapBugDetail(data as unknown as BugDetailRow);
}

export interface GetBugsOptions {
  limit?: number;
  /**
   * Si es `false` (default), se excluyen del resultado los bugs con
   * `status = 'cerrado'`. Útil para ahorrar ancho de banda cuando el
   * usuario solo quiere ver los bugs abiertos / en proceso / resueltos.
   */
  includeClosed?: boolean;
}

export async function getBugs(
  moduleId: string,
  options: GetBugsOptions = {},
): Promise<BugListItem[]> {
  let query = supabase
    .from("bugs")
    .select("id, module_id, name, description, status, priority")
    .eq("module_id", moduleId)
    .order("priority", { ascending: false })
    .order("name", { ascending: true });

  // Por defecto ocultamos los cerrados para no transferirlos.
  if (!options.includeClosed) {
    query = query.neq("status", "cerrado");
  }

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
  }));
}