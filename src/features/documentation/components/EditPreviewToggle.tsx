import { Code, Eye } from "lucide-react";

export type EditPreviewMode = "edit" | "preview";

interface EditPreviewToggleProps {
  mode: EditPreviewMode;
  onChange: (mode: EditPreviewMode) => void;
  disabled?: boolean;
}

export default function EditPreviewToggle({
  mode,
  onChange,
  disabled = false,
}: EditPreviewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Modo de edición"
      className="font-comfortaa inline-flex rounded-lg border border-neutral-300 bg-secondary p-0.5 text-xs"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "edit"}
        disabled={disabled}
        onClick={() => onChange("edit")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          mode === "edit"
            ? "bg-primary text-secondary shadow-sm"
            : "text-neutral-600 hover:text-primary"
        }`}
      >
        <Code className="h-3.5 w-3.5" />
        Editar
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "preview"}
        disabled={disabled}
        onClick={() => onChange("preview")}
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          mode === "preview"
            ? "bg-primary text-secondary shadow-sm"
            : "text-neutral-600 hover:text-primary"
        }`}
      >
        <Eye className="h-3.5 w-3.5" />
        Vista previa
      </button>
    </div>
  );
}