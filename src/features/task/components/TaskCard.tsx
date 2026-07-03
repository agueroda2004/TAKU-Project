import { useState, type KeyboardEvent } from "react";
import {
  Check,
  ChevronRight,
  ListChecks,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUS_TONES,
} from "../constants/taskConstants";
import {
  useCreateSubtask,
  useDeleteSubtask,
  useTask,
  useUpdateSubtask,
} from "../hooks/useTask";
import type { Subtask, TaskListItem } from "../task";

interface TaskCardProps {
  task: TaskListItem;
  onEdit: (task: TaskListItem) => void;
  onDelete: (task: TaskListItem) => void;
  onChangeStatus: (task: TaskListItem) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onChangeStatus,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const subtasksPanelId = `task-${task.id}-subtasks`;

  return (
    <article className="rounded-xl border border-neutral-200 bg-secondary p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={subtasksPanelId}
          className="font-comfortaa flex min-w-0 flex-1 items-start gap-2 rounded-md p-1 text-left transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        >
          <ChevronRight
            aria-hidden
            className={`mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold text-primary">
              {task.name}
            </h4>
            {task.description && (
              <p className="font-comfortaa mt-0.5 line-clamp-2 text-xs text-neutral-500">
                {task.description}
              </p>
            )}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(task);
            }}
            aria-label="Editar tarea"
            title="Editar tarea"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(task);
            }}
            aria-label="Eliminar tarea"
            title="Eliminar tarea"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="font-comfortaa mt-3 flex flex-wrap items-center gap-1.5 px-6">
        <button
          type="button"
          onClick={() => onChangeStatus(task)}
          title={`Estado actual: ${TASK_STATUS_LABELS[task.status]}. Click para cambiar.`}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${TASK_STATUS_TONES[task.status].pill}`}
        >
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full ${TASK_STATUS_TONES[task.status].dot}`}
          />
          {TASK_STATUS_LABELS[task.status]}
        </button>
        <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>
        <SubtaskCountBadge taskId={task.id} />
      </div>

      {isExpanded && (
        <SubtasksPanel taskId={task.id} panelId={subtasksPanelId} />
      )}
    </article>
  );
}

function SubtaskCountBadge({ taskId }: { taskId: string }) {
  const { data, isLoading } = useTask(taskId);
  const subtasks = data?.subtasks ?? [];
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.completed).length;
  if (isLoading || total === 0) return null;
  return (
    <span className="font-comfortaa inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
      <ListChecks className="h-2.5 w-2.5" />
      {done}/{total} {total === 1 ? "subtarea" : "subtareas"}
    </span>
  );
}

interface SubtasksPanelProps {
  taskId: string;
  panelId: string;
}

function SubtasksPanel({ taskId, panelId }: SubtasksPanelProps) {
  const { data: taskWithSubtasks, isLoading } = useTask(taskId);
  const subtasks: Subtask[] = taskWithSubtasks?.subtasks ?? [];

  const [draft, setDraft] = useState("");
  const [pendingSubtaskId, setPendingSubtaskId] = useState<string | null>(null);

  const { mutate: createSubtask, isPending: isCreating } = useCreateSubtask();
  const { mutate: updateSubtask } = useUpdateSubtask();
  const { mutate: deleteSubtask } = useDeleteSubtask();

  function handleAddSubtask() {
    const name = draft.trim();
    if (!name) return;
    createSubtask(
      { taskId, input: { name } },
      {
        onSuccess: () => {
          setDraft("");
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible agregar la subtarea.",
          );
        },
      },
    );
  }

  function handleAddOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSubtask();
    }
  }

  function handleToggleSubtask(subtask: Subtask) {
    setPendingSubtaskId(subtask.id);
    updateSubtask(
      {
        id: subtask.id,
        taskId,
        input: { completed: !subtask.completed },
      },
      {
        onSuccess: () => {
          setPendingSubtaskId(null);
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible actualizar la subtarea.",
          );
          setPendingSubtaskId(null);
        },
      },
    );
  }

  function handleDeleteSubtask(subtaskId: string) {
    setPendingSubtaskId(subtaskId);
    deleteSubtask(
      { id: subtaskId, taskId },
      {
        onSuccess: () => {
          notify.success("Subtarea eliminada.");
          setPendingSubtaskId(null);
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible eliminar la subtarea.",
          );
          setPendingSubtaskId(null);
        },
      },
    );
  }

  const canAdd = draft.trim().length > 0 && !isCreating;

  return (
    <div id={panelId} className="mt-4 border-t border-neutral-200 pt-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-comfortaa text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Subtareas
        </span>
        {!isLoading && subtasks.length > 0 && (
          <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">
            {subtasks.length}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleAddOnEnter}
          placeholder="Nombre de la subtarea"
          disabled={isCreating}
          className="font-comfortaa flex-1 rounded-lg border border-neutral-300 bg-secondary px-3 py-1.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <CustomButton
          type="button"
          size="sm"
          variant="outline"
          leftIcon={isCreating ? undefined : Plus}
          isLoading={isCreating}
          onClick={handleAddSubtask}
          disabled={!canAdd}
        >
          Agregar
        </CustomButton>
      </div>

      <div className="mt-2">
        {isLoading ? (
          <div className="space-y-1">
            <div className="h-7 w-full animate-pulse rounded-md bg-neutral-100" />
            <div className="h-7 w-2/3 animate-pulse rounded-md bg-neutral-100" />
          </div>
        ) : subtasks.length === 0 ? (
          <p className="font-comfortaa text-xs italic text-neutral-500">
            Aún no hay subtareas.
          </p>
        ) : (
          <ul className="space-y-1">
            {subtasks.map((subtask) => {
              const isPending = pendingSubtaskId === subtask.id;
              return (
                <li
                  key={subtask.id}
                  className="flex items-center gap-2 rounded-md border border-neutral-200 bg-secondary px-2 py-1.5 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(subtask)}
                    disabled={isPending}
                    aria-label={
                      subtask.completed
                        ? `Marcar "${subtask.name}" como pendiente`
                        : `Marcar "${subtask.name}" como terminada`
                    }
                    aria-pressed={subtask.completed}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                      subtask.completed
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-neutral-300 hover:border-primary"
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : subtask.completed ? (
                      <Check className="h-3 w-3" />
                    ) : null}
                  </button>
                  <span
                    className={`font-comfortaa min-w-0 flex-1 truncate ${
                      subtask.completed
                        ? "text-neutral-400 line-through"
                        : "text-primary"
                    }`}
                  >
                    {subtask.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    disabled={isPending}
                    aria-label={`Eliminar subtarea ${subtask.name}`}
                    className="font-comfortaa inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
