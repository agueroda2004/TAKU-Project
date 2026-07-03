import { NotebookPen, Pencil, Trash2 } from "lucide-react";
import type { NoteListItem } from "../note";

interface NoteCardProps {
  note: NoteListItem;
  onEdit: (note: NoteListItem) => void;
  onDelete: (note: NoteListItem) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <article className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <NotebookPen className="h-4 w-4 text-amber-600" />
        </div>

        <p className="font-comfortaa min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-primary">
          {note.text}
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(note)}
            aria-label="Editar nota"
            title="Editar nota"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-amber-100 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note)}
            aria-label="Eliminar nota"
            title="Eliminar nota"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}