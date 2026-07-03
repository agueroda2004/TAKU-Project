import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { CustomDropdown } from "../../../shared/components/CustomDropdown";
import { notify } from "../../../shared/utils/notify";
import {
  BUG_DEFAULT_PRIORITY,
  BUG_DEFAULT_STATUS,
  BUG_PRIORITIES,
  BUG_PRIORITY_LABELS,
  BUG_STATUSES,
  BUG_STATUS_LABELS,
} from "../constants/bugConstants";
import {
  bugSchema,
  formatBugErrors,
  type BugFieldErrors,
} from "../schemas/bugSchema";
import { useCreateBug } from "../hooks/useBug";
import type {
  BugPriority,
  BugStatus,
  CreateBugInput,
} from "../bug";

interface CreateBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
}

const initialState: CreateBugInput = {
  name: "",
  description: "",
  status: BUG_DEFAULT_STATUS,
  priority: BUG_DEFAULT_PRIORITY,
};

export default function CreateBugModal({
  isOpen,
  onClose,
  moduleId,
}: CreateBugModalProps) {
  const [form, setForm] = useState<CreateBugInput>(initialState);
  const [errors, setErrors] = useState<BugFieldErrors>({});
  const { mutate: createBug, isPending } = useCreateBug();

  function handleClose() {
    if (isPending) return;
    setForm(initialState);
    setErrors({});
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = bugSchema.safeParse(form);
    if (!result.success) {
      setErrors(formatBugErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    createBug(
      { moduleId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Bug creado correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible crear el bug.");
        },
      },
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo bug"
      description="Reportá un bug dentro de este módulo. Podés cambiar su estado después con un click."
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
            placeholder="Ej. Login falla con email vacío"
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
            placeholder="Pasos para reproducirlo, comportamiento esperado, etc."
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
            <CustomDropdown<BugStatus>
              options={BUG_STATUSES.map((value) => ({
                value,
                label: BUG_STATUS_LABELS[value],
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
            <CustomDropdown<BugPriority>
              options={BUG_PRIORITIES.map((value) => ({
                value,
                label: BUG_PRIORITY_LABELS[value],
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
            leftIcon={X}
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </CustomButton>
          <CustomButton type="submit" leftIcon={Plus} isLoading={isPending}>
            {isPending ? "Creando..." : "Crear bug"}
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