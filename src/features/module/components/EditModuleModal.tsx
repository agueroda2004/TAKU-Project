import { useCallback, useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { CustomDropdown } from "../../../shared/components/CustomDropdown";
import { IconPicker } from "../../project/components/IconPicker";
import { notify } from "../../../shared/utils/notify";
import {
  MODULE_PRIORITIES,
  MODULE_PRIORITY_LABELS,
  MODULE_STATUSES,
  MODULE_STATUS_LABELS,
} from "../constants/moduleConstants";
import {
  PROJECT_COLORS,
  PROJECT_COLOR_LABELS,
} from "../../project/constants/projectPalette";
import {
  moduleSchema,
  formatModuleErrors,
  type ModuleFieldErrors,
} from "../schemas/moduleSchema";
import { useUpdateModule } from "../hooks/useModule";
import { moduleToFormState } from "../utils/moduleUtils";
import type {
  CreateModuleInput,
  Module,
  ModulePriority,
  ModuleStatus,
} from "../module";

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
}

export default function EditModuleModal({
  isOpen,
  onClose,
  module,
}: EditModuleModalProps) {
  const [form, setForm] = useState<CreateModuleInput>(() =>
    moduleToFormState(module)
  );
  const [errors, setErrors] = useState<ModuleFieldErrors>({});
  const { mutate: updateModule, isPending } = useUpdateModule();

  const handleIconSelect = useCallback(
    (value: string | null) =>
      setForm((prev) => ({ ...prev, icon: value })),
    []
  );

  function handleClose() {
    if (isPending) return;
    setForm(moduleToFormState(module));
    setErrors({});
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = moduleSchema.safeParse(form);
    if (!result.success) {
      setErrors(formatModuleErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    updateModule(
      { id: module.id, projectId: module.projectId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Módulo actualizado correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible actualizar el módulo.");
        },
      }
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar módulo"
      description="Modifica los datos del módulo. Los cambios se guardan al confirmar."
      size="lg"
      closeOnBackdrop={!isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="mb-1 flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Nombre<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ej. Autenticación, Pagos, Notificaciones…"
              className={inputClass(Boolean(errors.name))}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="font-comfortaa text-xs text-red-600">
                {errors.name}
              </span>
            )}
          </label>
        </div>

        <div>
          <label className="mb-1 flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Descripción
            </span>
            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="¿De qué se encarga este módulo?"
              rows={3}
              className={inputClass(Boolean(errors.description))}
            />
            {errors.description && (
              <span className="font-comfortaa text-xs text-red-600">
                {errors.description}
              </span>
            )}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Estado
            </span>
            <CustomDropdown<ModuleStatus>
              options={MODULE_STATUSES.map((value) => ({
                value,
                label: MODULE_STATUS_LABELS[value],
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
            <CustomDropdown<ModulePriority>
              options={MODULE_PRIORITIES.map((value) => ({
                value,
                label: MODULE_PRIORITY_LABELS[value],
              }))}
              value={form.priority}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, priority: value }))
              }
            />
          </label>
        </div>

        <div>
          <span className="font-comfortaa mb-1 block text-sm font-medium text-neutral-700">
            Color
          </span>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((color) => {
              const selected = form.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      color: prev.color === color ? null : color,
                    }))
                  }
                  aria-label={PROJECT_COLOR_LABELS[color] ?? color}
                  aria-pressed={selected}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    selected
                      ? "border-primary scale-110"
                      : "border-neutral-200 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>

        <div>
          <span className="font-comfortaa mb-1 block text-sm font-medium text-neutral-700">
            Icono
          </span>
          <IconPicker value={form.icon} onSelect={handleIconSelect} />
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