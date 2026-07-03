import { useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  ListChecks,
  Plus,
  Trash2,
} from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import ChangeTaskStatusModal from "./ChangeTaskStatusModal";
import TaskCard from "./TaskCard";
import {
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "../hooks/useTask";
import { notify } from "../../../shared/utils/notify";
import {
  TASK_STATUS_LABELS,
} from "../constants/taskConstants";
import { taskListItemToFormState } from "../utils/taskUtils";
import type { TaskListItem, TaskStatus } from "../task";

interface ModuleTasksSectionProps {
  moduleId: string;
}

export default function ModuleTasksSection({
  moduleId,
}: ModuleTasksSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskListItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskListItem | null>(null);
  const [changingStatusTask, setChangingStatusTask] =
    useState<TaskListItem | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: tasks, isLoading } = useTasks(moduleId, {
    includeCompleted: showCompleted,
  });
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: updateTask, isPending: isUpdatingStatus } = useUpdateTask();

  function handleDelete() {
    if (!deletingTask) return;
    deleteTask(
      { id: deletingTask.id, moduleId: deletingTask.moduleId },
      {
        onSuccess: () => {
          notify.success("Tarea eliminada correctamente.");
          setDeletingTask(null);
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible eliminar la tarea.",
          );
        },
      },
    );
  }

  function handleCloseDelete() {
    if (isDeleting) return;
    setDeletingTask(null);
  }

  function handleChangeStatus(nextStatus: TaskStatus) {
    if (!changingStatusTask) return;
    updateTask(
      {
        id: changingStatusTask.id,
        moduleId: changingStatusTask.moduleId,
        input: {
          ...taskListItemToFormState(changingStatusTask),
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          notify.success(
            `Estado actualizado a ${TASK_STATUS_LABELS[nextStatus]}.`,
          );
          setChangingStatusTask(null);
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible cambiar el estado.",
          );
        },
      },
    );
  }

  function handleCloseChangeStatus() {
    if (isUpdatingStatus) return;
    setChangingStatusTask(null);
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-neutral-500" />
          <h3 className="font-comfortaa text-sm font-semibold text-primary">
            Tareas
          </h3>
          {!isLoading && tasks && tasks.length > 0 && (
            <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {tasks.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva tarea
        </button>
        <button
          type="button"
          onClick={() => setShowCompleted((prev) => !prev)}
          aria-pressed={showCompleted}
          title={
            showCompleted
              ? "Ocultar las tareas terminadas"
              : "Mostrar también las tareas terminadas"
          }
          className={`font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            showCompleted
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-primary"
          }`}
        >
          {showCompleted ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Ocultar terminadas
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Mostrar terminadas
            </>
          )}
        </button>
      </div>

      <TasksSectionBody
        tasks={tasks}
        isLoading={isLoading}
        showCompleted={showCompleted}
        onCreateClick={() => setIsCreateOpen(true)}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
        onChangeStatusTask={setChangingStatusTask}
        onToggleShowCompleted={() => setShowCompleted((prev) => !prev)}
      />

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        moduleId={moduleId}
      />

      {editingTask && (
        <EditTaskModal
          isOpen
          onClose={() => setEditingTask(null)}
          task={editingTask}
        />
      )}

      <ChangeTaskStatusModal
        isOpen={Boolean(changingStatusTask)}
        isUpdating={isUpdatingStatus}
        taskName={changingStatusTask?.name ?? ""}
        currentStatus={
          changingStatusTask?.status ?? "pendiente"
        }
        onClose={handleCloseChangeStatus}
        onConfirm={handleChangeStatus}
      />

      <Overlay
        isOpen={Boolean(deletingTask)}
        onClose={handleCloseDelete}
        title="Eliminar tarea"
        size="sm"
        closeOnBackdrop={!isDeleting}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-comfortaa text-sm font-semibold text-red-700">
                Esta acción no se puede deshacer.
              </p>
              <p className="font-comfortaa mt-1 text-sm text-red-600">
                Se eliminará la tarea{" "}
                <span className="font-semibold">
                  {deletingTask?.name ?? ""}
                </span>{" "}
                y todas sus subtareas asociadas.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleCloseDelete}
              disabled={isDeleting}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              type="button"
              variant="danger"
              leftIcon={Trash2}
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </CustomButton>
          </div>
        </div>
      </Overlay>
    </section>
  );
}

interface TasksSectionBodyProps {
  tasks: TaskListItem[] | undefined;
  isLoading: boolean;
  showCompleted: boolean;
  onCreateClick: () => void;
  onEditTask: (task: TaskListItem) => void;
  onDeleteTask: (task: TaskListItem) => void;
  onChangeStatusTask: (task: TaskListItem) => void;
  onToggleShowCompleted: () => void;
}

function TasksSectionBody({
  tasks,
  isLoading,
  showCompleted,
  onCreateClick,
  onEditTask,
  onDeleteTask,
  onChangeStatusTask,
  onToggleShowCompleted,
}: TasksSectionBodyProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
          />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <button
        type="button"
        onClick={onCreateClick}
        className="block w-full rounded-xl border border-dashed border-neutral-200 bg-secondary p-6 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
      >
        <ListChecks className="mx-auto h-8 w-8 text-neutral-300" />
        {showCompleted ? (
          <>
            <p className="font-comfortaa mt-2 text-sm text-neutral-500">
              Aún no hay tareas en este módulo.
            </p>
            <p className="font-comfortaa mt-1 text-xs font-semibold text-primary">
              Crear la primera
            </p>
          </>
        ) : (
          <>
            <p className="font-comfortaa mt-2 text-sm text-neutral-500">
              ¡Todo al día! No hay tareas pendientes.
            </p>
            <p className="font-comfortaa mt-3 text-xs text-neutral-500">
              ¿Necesitás revisar las terminadas?{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleShowCompleted();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleShowCompleted();
                  }
                }}
                className="font-semibold text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
              >
                Mostralas
              </span>
            </p>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onChangeStatus={onChangeStatusTask}
        />
      ))}
    </div>
  );
}
