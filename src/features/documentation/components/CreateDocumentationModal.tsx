import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  documentationSchema,
  formatDocumentationErrors,
  type DocumentationFieldErrors,
} from "../schemas/documentationSchema";
import { useCreateDocumentation } from "../hooks/useDocumentation";
import EditPreviewToggle, {
  type EditPreviewMode,
} from "./EditPreviewToggle";
import MarkdownPreview from "./MarkdownPreview";
import type { CreateDocumentationInput } from "../documentation";

interface CreateDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
}

const initialState: CreateDocumentationInput = {
  title: "",
  text: "",
};

export default function CreateDocumentationModal({
  isOpen,
  onClose,
  moduleId,
}: CreateDocumentationModalProps) {
  const [form, setForm] = useState<CreateDocumentationInput>(initialState);
  const [errors, setErrors] = useState<DocumentationFieldErrors>({});
  const [mode, setMode] = useState<EditPreviewMode>("edit");
  const { mutate: createDocumentation, isPending } = useCreateDocumentation();

  function handleClose() {
    if (isPending) return;
    setForm(initialState);
    setErrors({});
    setMode("edit");
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = documentationSchema.safeParse(form);
    if (!result.success) {
      setErrors(formatDocumentationErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    createDocumentation(
      { moduleId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Documentación creada correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible crear la documentación.");
        },
      },
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva documentación"
      description="Escribí la documentación en Markdown. Podés alternar entre editar y previsualizar."
      size="xl"
      closeOnBackdrop={!isPending}
      className="flex flex-col overflow-hidden p-0"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Título<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ej. Guía de instalación"
              autoFocus
              className={inputClass(Boolean(errors.title))}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <span className="font-comfortaa text-xs text-red-600">
                {errors.title}
              </span>
            )}
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-comfortaa text-sm font-medium text-neutral-700">
                Contenido (Markdown)
                <span className="ml-1 text-red-500">*</span>
              </span>
              <EditPreviewToggle
                mode={mode}
                onChange={setMode}
                disabled={isPending}
              />
            </div>

            {mode === "edit" ? (
              <textarea
                value={form.text}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder={"# Encabezado\n\nEscribí **Markdown** acá…"}
                rows={12}
                className={`${textareaClass(
                  Boolean(errors.text),
                )} font-mono text-sm`}
                aria-invalid={Boolean(errors.text)}
              />
            ) : (
              <div className="min-h-[280px] overflow-y-auto rounded-lg border border-neutral-300 bg-secondary p-4">
                {form.text.trim() ? (
                  <MarkdownPreview source={form.text} />
                ) : (
                  <p className="font-comfortaa text-sm italic text-neutral-400">
                    Nada para previsualizar todavía.
                  </p>
                )}
              </div>
            )}

            {errors.text && (
              <span className="font-comfortaa text-xs text-red-600">
                {errors.text}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-200 bg-secondary px-6 py-4">
          <CustomButton
            type="button"
            variant="outline"
            leftIcon={X}
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="submit"
            leftIcon={Plus}
            isLoading={isPending}
          >
            {isPending ? "Creando..." : "Crear documentación"}
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

function textareaClass(hasError: boolean): string {
  return `w-full resize-none rounded-lg border bg-secondary px-3 py-2 text-primary outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
  }`;
}