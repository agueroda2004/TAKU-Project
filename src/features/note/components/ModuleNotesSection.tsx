import { useState } from "react";
import {
  AlertCircle,
  NotebookPen,
  Plus,
  Trash2,
} from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import CreateNoteModal from "./CreateNoteModal";
import EditNoteModal from "./EditNoteModal";
import NoteCard from "./NoteCard";
import { useDeleteNote, useNotes } from "../hooks/useNote";
import { notify } from "../../../shared/utils/notify";
import type { NoteListItem } from "../note";

interface ModuleNotesSectionProps {
  moduleId: string;
}

export default function ModuleNotesSection({
  moduleId,
}: ModuleNotesSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteListItem | null>(null);
  const [deletingNote, setDeletingNote] = useState<NoteListItem | null>(null);

  const { data: notes, isLoading } = useNotes(moduleId);
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  function handleDelete() {
    if (!deletingNote) return;
    deleteNote(
      { id: deletingNote.id, moduleId: deletingNote.moduleId },
      {
        onSuccess: () => {
          notify.success("Nota eliminada correctamente.");
          setDeletingNote(null);
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible eliminar la nota.");
        },
      },
    );
  }

  function handleCloseDelete() {
    if (isDeleting) return;
    setDeletingNote(null);
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-neutral-500" />
          <h3 className="font-comfortaa text-sm font-semibold text-primary">
            Notas
          </h3>
          {!isLoading && notes && notes.length > 0 && (
            <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {notes.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva nota
        </button>
      </div>

      <NotesSectionBody
        notes={notes}
        isLoading={isLoading}
        onCreateClick={() => setIsCreateOpen(true)}
        onEditNote={setEditingNote}
        onDeleteNote={setDeletingNote}
      />

      <CreateNoteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        moduleId={moduleId}
      />

      {editingNote && (
        <EditNoteModal
          isOpen
          onClose={() => setEditingNote(null)}
          note={editingNote}
        />
      )}

      <Overlay
        isOpen={Boolean(deletingNote)}
        onClose={handleCloseDelete}
        title="Eliminar nota"
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
                Se eliminará la nota seleccionada.
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

interface NotesSectionBodyProps {
  notes: NoteListItem[] | undefined;
  isLoading: boolean;
  onCreateClick: () => void;
  onEditNote: (note: NoteListItem) => void;
  onDeleteNote: (note: NoteListItem) => void;
}

function NotesSectionBody({
  notes,
  isLoading,
  onCreateClick,
  onEditNote,
  onDeleteNote,
}: NotesSectionBodyProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
          />
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <button
        type="button"
        onClick={onCreateClick}
        className="block w-full rounded-xl border border-dashed border-neutral-200 bg-secondary p-6 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
      >
        <NotebookPen className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="font-comfortaa mt-2 text-sm text-neutral-500">
          Este módulo todavía no tiene notas.
        </p>
        <p className="font-comfortaa mt-1 text-xs font-semibold text-primary">
          Escribir la primera
        </p>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEditNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}