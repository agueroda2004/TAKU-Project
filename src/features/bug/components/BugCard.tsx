import { Bug as BugIcon, Pencil, Trash2 } from "lucide-react";
import {
  BUG_PRIORITY_LABELS,
  BUG_PRIORITY_TONES,
  BUG_STATUS_LABELS,
  BUG_STATUS_TONES,
} from "../constants/bugConstants";
import type { BugListItem } from "../bug";

interface BugCardProps {
  bug: BugListItem;
  onEdit: (bug: BugListItem) => void;
  onDelete: (bug: BugListItem) => void;
  onChangeStatus: (bug: BugListItem) => void;
}

export default function BugCard({
  bug,
  onEdit,
  onDelete,
  onChangeStatus,
}: BugCardProps) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-secondary p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
          <BugIcon className="h-4 w-4 text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-comfortaa truncate text-sm font-semibold text-primary">
            {bug.name}
          </h4>
          {bug.description && (
            <p className="font-comfortaa mt-0.5 line-clamp-2 text-xs text-neutral-500">
              {bug.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(bug)}
            aria-label="Editar bug"
            title="Editar bug"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(bug)}
            aria-label="Eliminar bug"
            title="Eliminar bug"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="font-comfortaa mt-3 flex flex-wrap items-center gap-1.5 pl-12">
        <button
          type="button"
          onClick={() => onChangeStatus(bug)}
          title={`Estado actual: ${BUG_STATUS_LABELS[bug.status]}. Click para cambiar.`}
          className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        >
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full ${BUG_STATUS_TONES[bug.status].dot}`}
          />
          {BUG_STATUS_LABELS[bug.status]}
        </button>
        <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${BUG_PRIORITY_TONES[bug.priority].dot}`}
          />
          {BUG_PRIORITY_LABELS[bug.priority]}
        </span>
      </div>
    </article>
  );
}