import { useState } from "react";
import { ChevronRight, FileText, Pencil, Trash2 } from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";
import { markdownToPlainText } from "../utils/documentationUtils";
import type { DocumentationListItem } from "../documentation";

interface DocumentationCardProps {
  documentation: DocumentationListItem;
  onEdit: (documentation: DocumentationListItem) => void;
  onDelete: (documentation: DocumentationListItem) => void;
}

export default function DocumentationCard({
  documentation,
  onEdit,
  onDelete,
}: DocumentationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `documentation-${documentation.id}-content`;
  const excerpt = markdownToPlainText(documentation.text);

  return (
    <article className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100">
          <FileText className="h-4 w-4 text-sky-600" />
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className="font-comfortaa flex min-w-0 flex-1 items-start gap-2 rounded-md p-1 text-left transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
        >
          <ChevronRight
            aria-hidden
            className={`mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold text-primary">
              {documentation.title}
            </h4>
            {!isExpanded && excerpt && (
              <p className="font-comfortaa mt-0.5 line-clamp-2 text-xs text-neutral-500">
                {excerpt}
              </p>
            )}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(documentation);
            }}
            aria-label="Editar documentación"
            title="Editar documentación"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-sky-100 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(documentation);
            }}
            aria-label="Eliminar documentación"
            title="Eliminar documentación"
            className="font-comfortaa inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id={panelId}
          className="font-comfortaa mt-3 rounded-lg border border-sky-100 bg-secondary p-3"
        >
          <MarkdownPreview source={documentation.text} />
        </div>
      )}
    </article>
  );
}