import { useState } from "react";
import {
  AlertCircle,
  Bug,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import CreateBugModal from "./CreateBugModal";
import EditBugModal from "./EditBugModal";
import ChangeBugStatusModal from "./ChangeBugStatusModal";
import BugCard from "./BugCard";
import { useBugs, useDeleteBug, useUpdateBug } from "../hooks/useBug";
import { notify } from "../../../shared/utils/notify";
import { BUG_STATUS_LABELS } from "../constants/bugConstants";
import { bugListItemToFormState } from "../utils/bugUtils";
import type { BugListItem, BugStatus } from "../bug";

interface ModuleBugsSectionProps {
  moduleId: string;
}

export default function ModuleBugsSection({
  moduleId,
}: ModuleBugsSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBug, setEditingBug] = useState<BugListItem | null>(null);
  const [deletingBug, setDeletingBug] = useState<BugListItem | null>(null);
  const [changingStatusBug, setChangingStatusBug] =
    useState<BugListItem | null>(null);
  const [showClosed, setShowClosed] = useState(false);

  const { data: bugs, isLoading } = useBugs(moduleId, {
    includeClosed: showClosed,
  });
  const { mutate: deleteBug, isPending: isDeleting } = useDeleteBug();
  const { mutate: updateBug, isPending: isUpdatingStatus } = useUpdateBug();

  function handleDelete() {
    if (!deletingBug) return;
    deleteBug(
      { id: deletingBug.id, moduleId: deletingBug.moduleId },
      {
        onSuccess: () => {
          notify.success("Bug eliminado correctamente.");
          setDeletingBug(null);
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible eliminar el bug.");
        },
      },
    );
  }

  function handleCloseDelete() {
    if (isDeleting) return;
    setDeletingBug(null);
  }

  function handleChangeStatus(nextStatus: BugStatus) {
    if (!changingStatusBug) return;
    updateBug(
      {
        id: changingStatusBug.id,
        moduleId: changingStatusBug.moduleId,
        input: {
          ...bugListItemToFormState(changingStatusBug),
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          notify.success(
            `Estado actualizado a ${BUG_STATUS_LABELS[nextStatus]}.`,
          );
          setChangingStatusBug(null);
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible cambiar el estado.");
        },
      },
    );
  }

  function handleCloseChangeStatus() {
    if (isUpdatingStatus) return;
    setChangingStatusBug(null);
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-neutral-500" />
          <h3 className="font-comfortaa text-sm font-semibold text-primary">
            Bugs
          </h3>
          {!isLoading && bugs && bugs.length > 0 && (
            <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {bugs.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo bug
        </button>
        <button
          type="button"
          onClick={() => setShowClosed((prev) => !prev)}
          aria-pressed={showClosed}
          title={
            showClosed
              ? "Ocultar los bugs cerrados"
              : "Mostrar también los bugs cerrados"
          }
          className={`font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            showClosed
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-primary"
          }`}
        >
          {showClosed ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Ocultar cerrados
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Mostrar cerrados
            </>
          )}
        </button>
      </div>

      <BugsSectionBody
        bugs={bugs}
        isLoading={isLoading}
        showClosed={showClosed}
        onCreateClick={() => setIsCreateOpen(true)}
        onEditBug={setEditingBug}
        onDeleteBug={setDeletingBug}
        onChangeStatusBug={setChangingStatusBug}
        onToggleShowClosed={() => setShowClosed((prev) => !prev)}
      />

      <CreateBugModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        moduleId={moduleId}
      />

      {editingBug && (
        <EditBugModal
          isOpen
          onClose={() => setEditingBug(null)}
          bug={editingBug}
        />
      )}

      <ChangeBugStatusModal
        isOpen={Boolean(changingStatusBug)}
        isUpdating={isUpdatingStatus}
        bugName={changingStatusBug?.name ?? ""}
        currentStatus={changingStatusBug?.status ?? "abierto"}
        onClose={handleCloseChangeStatus}
        onConfirm={handleChangeStatus}
      />

      <Overlay
        isOpen={Boolean(deletingBug)}
        onClose={handleCloseDelete}
        title="Eliminar bug"
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
                Se eliminará el bug{" "}
                <span className="font-semibold">
                  {deletingBug?.name ?? ""}
                </span>
                .
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

interface BugsSectionBodyProps {
  bugs: BugListItem[] | undefined;
  isLoading: boolean;
  showClosed: boolean;
  onCreateClick: () => void;
  onEditBug: (bug: BugListItem) => void;
  onDeleteBug: (bug: BugListItem) => void;
  onChangeStatusBug: (bug: BugListItem) => void;
  onToggleShowClosed: () => void;
}

function BugsSectionBody({
  bugs,
  isLoading,
  showClosed,
  onCreateClick,
  onEditBug,
  onDeleteBug,
  onChangeStatusBug,
  onToggleShowClosed,
}: BugsSectionBodyProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
          />
        ))}
      </div>
    );
  }

  if (!bugs || bugs.length === 0) {
    return (
      <button
        type="button"
        onClick={onCreateClick}
        className="block w-full rounded-xl border border-dashed border-neutral-200 bg-secondary p-6 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
      >
        <Bug className="mx-auto h-8 w-8 text-neutral-300" />
        {showClosed ? (
          <>
            <p className="font-comfortaa mt-2 text-sm text-neutral-500">
              Este módulo no tiene bugs reportados.
            </p>
            <p className="font-comfortaa mt-1 text-xs font-semibold text-primary">
              Reportar el primero
            </p>
          </>
        ) : (
          <>
            <p className="font-comfortaa mt-2 text-sm text-neutral-500">
              ¡Todo al día! No hay bugs abiertos ni en curso.
            </p>
            <p className="font-comfortaa mt-3 text-xs text-neutral-500">
              ¿Necesitás revisar los cerrados?{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleShowClosed();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleShowClosed();
                  }
                }}
                className="font-semibold text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
              >
                Mostralos
              </span>
            </p>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {bugs.map((bug) => (
        <BugCard
          key={bug.id}
          bug={bug}
          onEdit={onEditBug}
          onDelete={onDeleteBug}
          onChangeStatus={onChangeStatusBug}
        />
      ))}
    </div>
  );
}