import { useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { CustomDropdown } from "../../../shared/components/CustomDropdown";
import { notify } from "../../../shared/utils/notify";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "../constants/taskConstants";
import {
  taskSchema,
  formatTaskErrors,
  type TaskFieldErrors,
} from "../schemas/taskSchema";
import { useUpdateTask } from "../hooks/useTask";
import { taskListItemToFormState } from "../utils/taskUtils";
import type {
  CreateTaskInput,
  TaskListItem,
  TaskPriority,
  TaskStatus,
} from "../task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskListItem;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
}: EditTaskModalProps) {
  const [form, setForm] = useState<CreateTaskInput>(() =>
    taskListItemToFormState(task),
  );
  const [errors, setErrors] = useState<TaskFieldErrors>({});
  const { mutate: updateTask, isPending } = useUpdateTask();

  function handleClose() {
    if (isPending) return;
    setForm(taskListItemToFormState(task));
    setErrors({});
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse(form);
    if (!result.success) {
      setErrors(formatTaskErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    updateTask(
      { id: task.id, moduleId: task.moduleId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Tarea actualizada correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible actualizar la tarea.",
          );
        },
      },
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar tarea"
      description="Modifica los datos de la tarea. Los cambios se guardan al confirmar."
      size="md"
      closeOnBackdrop={!isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-sm font-medium text-neutral-700">
            Nombre<span className="ml-1 text-red-500">*</span>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ej. Configurar variables de entorno"
            className={inputClass(Boolean(errors.name))}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <span className="font-comfortaa text-xs text-red-600">
              {errors.name}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-sm font-medium text-neutral-700">
            Descripción
          </span>
          <textarea
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="¿Qué hay que hacer exactamente?"
            rows={3}
            className={inputClass(Boolean(errors.description))}
          />
          {errors.description && (
            <span className="font-comfortaa text-xs text-red-600">
              {errors.description}
            </span>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Estado
            </span>
            <CustomDropdown<TaskStatus>
              options={TASK_STATUSES.map((value) => ({
                value,
                label: TASK_STATUS_LABELS[value],
              }))}
              value={form.status}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Prioridad
            </span>
            <CustomDropdown<TaskPriority>
              options={TASK_PRIORITIES.map((value) => ({
                value,
                label: TASK_PRIORITY_LABELS[value],
              }))}
              value={form.priority}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, priority: value }))
              }
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-200 pt-4">
          <CustomButton
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="submit"
            leftIcon={Pencil}
            isLoading={isPending}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </CustomButton>
        </div>
      </form>
    </Overlay>
  );
}

function inputClass(hasError: boolean): string {
  return `font-comfortaa w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
  }`;
}
