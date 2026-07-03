import type {
  Bug,
  BugListItem,
  BugStatus,
  CreateBugInput,
} from "../bug";
import { BUG_STATUS_LABELS } from "../constants/bugConstants";

type BugFormSource = Pick<
  Bug,
  "name" | "description" | "status" | "priority"
>;

export function bugToFormState(bug: BugFormSource): CreateBugInput {
  return {
    name: bug.name,
    description: bug.description ?? "",
    status: bug.status,
    priority: bug.priority,
  };
}

/**
 * Mapea un `BugListItem` a la entrada aceptada por el formulario de
 * creación / edición. Equivalente a `bugToFormState` pero tipado
 * explícitamente para los ítems que devuelve `useBugs`.
 */
export function bugListItemToFormState(bug: BugListItem): CreateBugInput {
  return bugToFormState(bug);
}

export function getStatusLabel(status: BugStatus): string {
  return BUG_STATUS_LABELS[status];
}