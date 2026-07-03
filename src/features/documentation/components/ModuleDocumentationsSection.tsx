import { useState } from "react";
import {
  AlertCircle,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import CreateDocumentationModal from "./CreateDocumentationModal";
import EditDocumentationModal from "./EditDocumentationModal";
import DocumentationCard from "./DocumentationCard";
import {
  useDeleteDocumentation,
  useDocumentations,
} from "../hooks/useDocumentation";
import { notify } from "../../../shared/utils/notify";
import type { DocumentationListItem } from "../documentation";

interface ModuleDocumentationsSectionProps {
  moduleId: string;
}

export default function ModuleDocumentationsSection({
  moduleId,
}: ModuleDocumentationsSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDoc, setEditingDoc] =
    useState<DocumentationListItem | null>(null);
  const [deletingDoc, setDeletingDoc] =
    useState<DocumentationListItem | null>(null);

  const { data: documentations, isLoading } = useDocumentations(moduleId);
  const { mutate: deleteDocumentation, isPending: isDeleting } =
    useDeleteDocumentation();

  function handleDelete() {
    if (!deletingDoc) return;
    deleteDocumentation(
      { id: deletingDoc.id, moduleId: deletingDoc.moduleId },
      {
        onSuccess: () => {
          notify.success("Documentación eliminada correctamente.");
          setDeletingDoc(null);
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible eliminar la documentación.",
          );
        },
      },
    );
  }

  function handleCloseDelete() {
    if (isDeleting) return;
    setDeletingDoc(null);
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-neutral-500" />
          <h3 className="font-comfortaa text-sm font-semibold text-primary">
            Documentación
          </h3>
          {!isLoading && documentations && documentations.length > 0 && (
            <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {documentations.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva documentación
        </button>
      </div>

      <DocumentationsSectionBody
        documentations={documentations}
        isLoading={isLoading}
        onCreateClick={() => setIsCreateOpen(true)}
        onEditDoc={setEditingDoc}
        onDeleteDoc={setDeletingDoc}
      />

      <CreateDocumentationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        moduleId={moduleId}
      />

      {editingDoc && (
        <EditDocumentationModal
          isOpen
          onClose={() => setEditingDoc(null)}
          documentation={editingDoc}
        />
      )}

      <Overlay
        isOpen={Boolean(deletingDoc)}
        onClose={handleCloseDelete}
        title="Eliminar documentación"
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
                Se eliminará la documentación seleccionada.
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

interface DocumentationsSectionBodyProps {
  documentations: DocumentationListItem[] | undefined;
  isLoading: boolean;
  onCreateClick: () => void;
  onEditDoc: (documentation: DocumentationListItem) => void;
  onDeleteDoc: (documentation: DocumentationListItem) => void;
}

function DocumentationsSectionBody({
  documentations,
  isLoading,
  onCreateClick,
  onEditDoc,
  onDeleteDoc,
}: DocumentationsSectionBodyProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
          />
        ))}
      </div>
    );
  }

  if (!documentations || documentations.length === 0) {
    return (
      <button
        type="button"
        onClick={onCreateClick}
        className="block w-full rounded-xl border border-dashed border-neutral-200 bg-secondary p-6 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
      >
        <FileText className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="font-comfortaa mt-2 text-sm text-neutral-500">
          Este módulo todavía no tiene documentación.
        </p>
        <p className="font-comfortaa mt-1 text-xs font-semibold text-primary">
          Crear la primera
        </p>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {documentations.map((documentation) => (
        <DocumentationCard
          key={documentation.id}
          documentation={documentation}
          onEdit={onEditDoc}
          onDelete={onDeleteDoc}
        />
      ))}
    </div>
  );
}