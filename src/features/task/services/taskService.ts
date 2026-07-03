import { supabase } from "../../../config/supabase";
import type {
  CreateSubtaskInput,
  CreateTaskInput,
  TaskListItem,
  TaskWithSubtasks,
  UpdateSubtaskInput,
} from "../task";

type TaskPayload = Omit<CreateTaskInput, never>;

export async function createTask(
  moduleId: string,
  input: CreateTaskInput,
): Promise<void> {
  const payload: TaskPayload = input;

  const { error } = await supabase.rpc("create_task", {
    p_module_id: moduleId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateTask(
  id: string,
  input: CreateTaskInput,
): Promise<void> {
  const payload: TaskPayload = input;

  const { error } = await supabase.rpc("update_task", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  // RLS se encarga del ownership. Las subtareas se borran solas
  // gracias al ON DELETE CASCADE de la FK subtasks.task_id → tasks.id.
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

interface SubtaskRow {
  id: string;
  task_id: string;
  name: string;
  completed: boolean;
  created_at: string;
}

interface TaskDetailRow {
  id: string;
  module_id: string;
  name: string;
  description: string | null;
  status: TaskWithSubtasks["status"];
  priority: TaskWithSubtasks["priority"];
  created_at: string;
  updated_at: string;
  subtasks: SubtaskRow[] | null;
}

function mapTaskDetail(row: TaskDetailRow): TaskWithSubtasks {
  return {
    id: row.id,
    moduleId: row.module_id,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subtasks: (row.subtasks ?? []).map((subtask) => ({
      id: subtask.id,
      taskId: subtask.task_id,
      name: subtask.name,
      completed: subtask.completed,
      createdAt: subtask.created_at,
    })),
  };
}

export async function getTaskById(id: string): Promise<TaskWithSubtasks> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
        id, module_id, name, description, status, priority,
        created_at, updated_at,
        subtasks(id, task_id, name, completed, created_at)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Tarea no encontrada.");
  }

  return mapTaskDetail(data as unknown as TaskDetailRow);
}

export interface GetTasksOptions {
  limit?: number;
  /**
   * Si es `false` (default), se excluyen del resultado las tareas con
   * `status = 'terminada'`. Útil para ahorrar ancho de banda cuando el
   * usuario solo quiere ver el trabajo pendiente.
   */
  includeCompleted?: boolean;
}

export async function getTasks(
  moduleId: string,
  options: GetTasksOptions = {},
): Promise<TaskListItem[]> {
  let query = supabase
    .from("tasks")
    .select("id, module_id, name, description, status, priority")
    .eq("module_id", moduleId)
    .order("priority", { ascending: false })
    .order("name", { ascending: true });

  // Por defecto ocultamos las terminadas para no transferirlas.
  if (!options.includeCompleted) {
    query = query.neq("status", "terminada");
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

type SubtaskPayload = CreateSubtaskInput;

export async function createSubtask(
  taskId: string,
  input: CreateSubtaskInput,
): Promise<void> {
  const payload: SubtaskPayload = input;

  const { error } = await supabase.rpc("create_subtask", {
    p_task_id: taskId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateSubtask(
  id: string,
  input: UpdateSubtaskInput,
): Promise<void> {
  const payload: UpdateSubtaskInput = input;

  const { error } = await supabase.rpc("update_subtask", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase.from("subtasks").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
