import type { CreateTaskInput, Task, TaskListItem, TaskStatus } from "../task";
import { TASK_STATUS_LABELS } from "../constants/taskConstants";

type TaskFormSource = Pick<
  Task,
  "name" | "description" | "status" | "priority"
>;

export function taskToFormState(task: TaskFormSource): CreateTaskInput {
  return {
    name: task.name,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
  };
}

/**
 * Mapa una `TaskListItem` a la entrada aceptada por el formulario de
 * creación / edición. Equivalente a `taskToFormState` pero tipado
 * explícitamente para los ítems que devuelve `useTasks`.
 */
export function taskListItemToFormState(
  task: TaskListItem,
): CreateTaskInput {
  return taskToFormState(task);
}

export function getStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_LABELS[status];
}
