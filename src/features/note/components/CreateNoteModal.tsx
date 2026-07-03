import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  noteSchema,
  formatNoteErrors,
  type NoteFieldErrors,
} from "../schemas/noteSchema";
import { useCreateNote } from "../hooks/useNote";
import type { CreateNoteInput } from "../note";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
}

const initialState: CreateNoteInput = {
  text: "",
};

export default function CreateNoteModal({
  isOpen,
  onClose,
  moduleId,
}: CreateNoteModalProps) {
  const [form, setForm] = useState<CreateNoteInput>(initialState);
  const [errors, setErrors] = useState<NoteFieldErrors>({});
  const { mutate: createNote, isPending } = useCreateNote();

  function handleClose() {
    if (isPending) return;
    setForm(initialState);
    setErrors({});
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = noteSchema.safeParse(form);
    if (!result.success) {
      setErrors(formatNoteErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    createNote(
      { moduleId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Nota creada correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible crear la nota.");
        },
      },
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva nota"
      description="Escribí una nota rápida para este módulo. Solo es texto libre."
      size="md"
      closeOnBackdrop={!isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-sm font-medium text-neutral-700">
            Texto<span className="ml-1 text-red-500">*</span>
          </span>
          <textarea
            value={form.text}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Ej. Recordar validar el payload antes de enviar a la API…"
            rows={6}
            autoFocus
            className={textareaClass(Boolean(errors.text))}
            aria-invalid={Boolean(errors.text)}
          />
          {errors.text && (
            <span className="font-comfortaa text-xs text-red-600">
              {errors.text}
            </span>
          )}
        </label>

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
            {isPending ? "Creando..." : "Crear nota"}
          </CustomButton>
        </div>
      </form>
    </Overlay>
  );
}

function textareaClass(hasError: boolean): string {
  return `font-comfortaa w-full resize-none rounded-lg border bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
  }`;
}