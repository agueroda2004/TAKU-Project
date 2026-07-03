export type TaskPriority = "baja" | "media" | "alta";

export type TaskStatus = "pendiente" | "en_proceso" | "terminada";

export interface Task {
  id: string;
  moduleId: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  name: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskWithSubtasks extends Task {
  subtasks: Subtask[];
}

export interface TaskListItem {
  id: string;
  moduleId: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CreateTaskInput {
  name: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CreateSubtaskInput {
  name: string;
  completed?: boolean;
}

export interface UpdateSubtaskInput {
  name?: string;
  completed?: boolean;
}
