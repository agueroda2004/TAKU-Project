import { useState, type FormEvent } from "react";
import { Pencil, X } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  noteSchema,
  formatNoteErrors,
  type NoteFieldErrors,
} from "../schemas/noteSchema";
import { useUpdateNote } from "../hooks/useNote";
import { noteListItemToFormState } from "../utils/noteUtils";
import type { CreateNoteInput, NoteListItem } from "../note";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteListItem;
}

export default function EditNoteModal({
  isOpen,
  onClose,
  note,
}: EditNoteModalProps) {
  const [form, setForm] = useState<CreateNoteInput>(() =>
    noteListItemToFormState(note),
  );
  const [errors, setErrors] = useState<NoteFieldErrors>({});
  const { mutate: updateNote, isPending } = useUpdateNote();

  function handleClose() {
    if (isPending) return;
    setForm(noteListItemToFormState(note));
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

    updateNote(
      { id: note.id, moduleId: note.moduleId, input: result.data },
      {
        onSuccess: () => {
          notify.success("Nota actualizada correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible actualizar la nota.");
        },
      },
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar nota"
      description="Modificá el texto de la nota. Los cambios se guardan al confirmar."
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
            placeholder="Escribí el texto de la nota…"
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

function textareaClass(hasError: boolean): string {
  return `font-comfortaa w-full resize-none rounded-lg border bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
  }`;
}