import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { CustomButton } from "../../../shared/components/CustomButton";
import Overlay from "../../../shared/components/Overlay";
import EditModuleModal from "../components/EditModuleModal";
import ChangeStatusModal from "../components/ChangeStatusModal";
import ModuleTasksSection from "../../task/components/ModuleTasksSection";
import ModuleBugsSection from "../../bug/components/ModuleBugsSection";
import ModuleNotesSection from "../../note/components/ModuleNotesSection";
import ModuleDocumentationsSection from "../../documentation/components/ModuleDocumentationsSection";
import {
  useDeleteModule,
  useModule,
  useUpdateModule,
} from "../hooks/useModule";
import { useProject } from "../../project/hooks/useProject";
import {
  PROJECT_COLOR_LABELS,
  PROJECT_ICON_MAP,
} from "../../project/constants/projectPalette";
import {
  MODULE_PRIORITY_LABELS,
  MODULE_PRIORITY_TONES,
  MODULE_STATUS_LABELS,
  MODULE_STATUS_TONES,
} from "../constants/moduleConstants";
import { getNextStatus, moduleToFormState } from "../utils/moduleUtils";
import { notify } from "../../../shared/utils/notify";

export default function ModuleDetailPage() {
  const { projectId, moduleId } = useParams<{
    projectId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();
  const { data: project } = useProject(projectId);
  const { data: module, isLoading, isError, error } = useModule(moduleId);
  const { mutate: deleteModule, isPending: isDeleting } = useDeleteModule();
  const { mutate: updateModule, isPending: isUpdatingStatus } =
    useUpdateModule();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);

  const nextStatus = module ? getNextStatus(module.status) : null;

  function handleDelete() {
    if (!module) return;
    deleteModule(
      { id: module.id, projectId: module.projectId },
      {
        onSuccess: () => {
          notify.success("Módulo eliminado correctamente.");
          setIsDeleteOpen(false);
          navigate(`/projects/${module.projectId}/modules`, { replace: true });
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible eliminar el módulo.");
        },
      },
    );
  }

  function handleChangeStatus() {
    if (!module || !nextStatus) return;
    updateModule(
      {
        id: module.id,
        projectId: module.projectId,
        input: { ...moduleToFormState(module), status: nextStatus },
      },
      {
        onSuccess: () => {
          notify.success(
            `Módulo movido a ${MODULE_STATUS_LABELS[nextStatus]}.`,
          );
          setIsChangeStatusOpen(false);
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible cambiar el estado.");
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-32 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <Link
            to={projectId ? `/projects/${projectId}/modules` : "/projects"}
            className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a módulos
          </Link>
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-comfortaa text-sm font-semibold text-red-700">
                No fue posible cargar el módulo.
              </p>
              <p className="font-comfortaa mt-1 text-xs text-red-600">
                {error?.message ?? "Error desconocido"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <Link
            to={projectId ? `/projects/${projectId}/modules` : "/projects"}
            className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a módulos
          </Link>
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-secondary p-10 text-center">
            <p className="font-comfortaa text-sm text-neutral-500">
              No se encontró el módulo solicitado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = module.icon ? PROJECT_ICON_MAP[module.icon] : undefined;
  const Icon = IconComponent ?? Package;

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${module.projectId}/modules`}
            className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a módulos
            {project && (
              <span className="text-neutral-400"> de {project.name}</span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <CustomButton
              type="button"
              variant="outline"
              leftIcon={Trash2}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar
            </CustomButton>
            <CustomButton
              type="button"
              variant="primary"
              leftIcon={Pencil}
              onClick={() => setIsEditOpen(true)}
            >
              Editar
            </CustomButton>
          </div>
        </div>

        <header className="rounded-2xl border border-neutral-200 bg-secondary p-6 shadow-sm ">
          <div
            className="w-full h-1 bg-black mb-4 rounded-full"
            style={{
              backgroundColor: `${module.color}`,
            }}
          />
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: module.color ? `${module.color}1a` : undefined,
              }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: module.color ?? "var(--color-primary)" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-comfortaa text-2xl font-bold text-primary">
                {module.name}
              </h1>
              {module.description && (
                <p className="font-comfortaa mt-1 text-sm text-neutral-500">
                  {module.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nextStatus ? (
              <button
                type="button"
                onClick={() => setIsChangeStatusOpen(true)}
                title={`Avanzar a ${MODULE_STATUS_LABELS[nextStatus]}`}
                className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              >
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${MODULE_STATUS_TONES[module.status].dot}`}
                />
                {MODULE_STATUS_LABELS[module.status]}
                <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${MODULE_STATUS_TONES[module.status].dot}`}
                />
                {MODULE_STATUS_LABELS[module.status]}
              </span>
            )}
            <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${MODULE_PRIORITY_TONES[module.priority].dot}`}
              />
              {MODULE_PRIORITY_LABELS[module.priority]}
            </span>
            {module.color && (
              <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: module.color }}
                />
                {PROJECT_COLOR_LABELS[module.color] ?? module.color}
              </span>
            )}
          </div>
        </header>

        <ModuleTasksSection moduleId={module.id} />

        <ModuleBugsSection moduleId={module.id} />

        <ModuleNotesSection moduleId={module.id} />

        <ModuleDocumentationsSection moduleId={module.id} />

        <EditModuleModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          module={module}
        />

        {nextStatus && (
          <ChangeStatusModal
            isOpen={isChangeStatusOpen}
            isUpdating={isUpdatingStatus}
            moduleName={module.name}
            currentStatus={module.status}
            nextStatus={nextStatus}
            onClose={() => setIsChangeStatusOpen(false)}
            onConfirm={handleChangeStatus}
          />
        )}

        <Overlay
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Eliminar módulo"
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
                  Se eliminará el módulo{" "}
                  <span className="font-semibold">{module.name}</span> y todas
                  sus tareas asociadas.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <CustomButton
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
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
      </div>
    </div>
  );
}
