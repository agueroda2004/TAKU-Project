import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Code2,
  Database,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Link2,
  Pencil,
  PencilRuler,
  ServerCog,
  Server as ServerIcon,
  Star,
  Trash2,
} from "lucide-react";
import { Section } from "../../../shared/components/Section";
import { CustomButton } from "../../../shared/components/CustomButton";
import Overlay from "../../../shared/components/Overlay";
import EditProjectModal from "../components/EditProjectModal";
import ChangeStatusModal from "../components/ChangeStatusModal";
import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "../hooks/useProject";
import { notify } from "../../../shared/utils/notify";
import {
  PROJECT_PRIORITY_LABELS,
  PROJECT_STATUS_LABELS,
  TECH_CATEGORY_LABELS,
  REPO_TYPE_LABELS,
} from "../constants/projectConstants";
import { PROJECT_ICON_MAP } from "../constants/projectPalette";
import {
  getNextStatus,
  getStatusLabel,
  projectToFormState,
} from "../utils/projectUtils";
import type {
  Project,
  ProjectStatus,
  RepoType,
  TechCategory,
} from "../project";
import ProjectModulesSection from "../../module/components/ProjectModulesSection";

const techCategories: TechCategory[] = ["frontend", "backend", "database"];

const techCategoryIcons: Record<TechCategory, typeof Code2> = {
  frontend: Code2,
  backend: ServerIcon,
  database: Database,
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useProject(id);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: updateProject, isPending: isUpdatingStatus } =
    useUpdateProject();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);

  const nextStatus = project ? getNextStatus(project.status) : null;

  function handleDelete() {
    if (!project) return;
    deleteProject(project.id, {
      onSuccess: () => {
        notify.success("Proyecto eliminado correctamente.");
        setIsDeleteOpen(false);
        navigate("/projects", { replace: true });
      },
      onError: (err) => {
        notify.error(err.message || "No fue posible eliminar el proyecto.");
      },
    });
  }

  function handleChangeStatus() {
    if (!project || !nextStatus) return;
    updateProject(
      {
        id: project.id,
        input: { ...projectToFormState(project), status: nextStatus },
      },
      {
        onSuccess: () => {
          notify.success(
            `Proyecto movido a ${PROJECT_STATUS_LABELS[nextStatus]}.`,
          );
          setIsChangeStatusOpen(false);
        },
        onError: (err) => {
          notify.error(err.message || "No fue posible cambiar el estado.");
        },
      },
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/projects"
            className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a proyectos
          </Link>
          {project && (
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
          )}
        </div>

        {isLoading ? (
          <DetailSkeleton />
        ) : isError ? (
          <DetailError
            message={error?.message ?? "Error desconocido"}
            onBack={() => navigate("/projects")}
          />
        ) : !project ? (
          <DetailNotFound onBack={() => navigate("/projects")} />
        ) : (
          <>
            <ProjectDetail
              project={project}
              nextStatus={nextStatus}
              onChangeStatusClick={() => setIsChangeStatusOpen(true)}
            />
            <EditProjectModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              project={project}
            />
            <DeleteProjectModal
              isOpen={isDeleteOpen}
              isDeleting={isDeleting}
              projectName={project.name}
              onClose={() => setIsDeleteOpen(false)}
              onConfirm={handleDelete}
            />
            {nextStatus && (
              <ChangeStatusModal
                isOpen={isChangeStatusOpen}
                isUpdating={isUpdatingStatus}
                projectName={project.name}
                currentStatusLabel={getStatusLabel(project.status)}
                nextStatusLabel={getStatusLabel(nextStatus)}
                onClose={() => setIsChangeStatusOpen(false)}
                onConfirm={handleChangeStatus}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface DeleteProjectModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteProjectModal({
  isOpen,
  isDeleting,
  projectName,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar proyecto"
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
              Se eliminará el proyecto{" "}
              <span className="font-semibold">{projectName}</span> junto con sus
              tecnologías, repositorios y servicios asociados.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="button"
            variant="danger"
            leftIcon={Trash2}
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </CustomButton>
        </div>
      </div>
    </Overlay>
  );
}

function ProjectDetail({
  project,
  nextStatus,
  onChangeStatusClick,
}: {
  project: Project;
  nextStatus: ProjectStatus | null;
  onChangeStatusClick: () => void;
}) {
  const IconComponent = project.icon
    ? PROJECT_ICON_MAP[project.icon]
    : undefined;
  const Icon = IconComponent ?? FolderKanban;

  return (
    <>
      <header className="rounded-2xl border border-neutral-200 bg-secondary p-6 shadow-sm">
        <div
          className="w-full rounded-full h-1 mb-4"
          style={{
            backgroundColor: project.color ? `${project.color}` : undefined,
          }}
        />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: project.color
                  ? `${project.color}1a`
                  : undefined,
              }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: project.color ?? "var(--color-primary)" }}
              />
            </div>
            <div>
              <h1 className="font-comfortaa text-2xl font-bold text-primary">
                {project.name}
              </h1>
              <p className="font-comfortaa mt-1 text-sm text-neutral-500">
                {project.description ?? "Sin descripción."}
              </p>
            </div>
          </div>
          {project.isFavorite && (
            <Star
              className="h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400"
              aria-label="Favorito"
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {nextStatus ? (
            <button
              type="button"
              onClick={onChangeStatusClick}
              title={`Avanzar a ${PROJECT_STATUS_LABELS[nextStatus]}`}
              className="font-comfortaa inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700 transition hover:bg-neutral-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              {PROJECT_STATUS_LABELS[project.status]}
              <ArrowRight className="h-3 w-3" />
            </button>
          ) : (
            <span className="font-comfortaa inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
          )}
          <span className="font-comfortaa inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">
            Prioridad: {PROJECT_PRIORITY_LABELS[project.priority]}
          </span>
        </div>
      </header>

      <ProjectModulesSection projectId={project.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <Section icon={Calendar} title="Fechas">
          <DetailRow label="Inicio" value={formatDate(project.startDate)} />
          <DetailRow label="Fin" value={formatDate(project.endDate)} />
        </Section>

        <Section icon={Link2} title="Repositorios">
          {project.repositories.length === 0 ? (
            <p className="font-comfortaa text-sm text-neutral-500">
              Sin repositorios.
            </p>
          ) : (
            <ul className="space-y-2">
              {project.repositories.map((repo, index) => (
                <li
                  key={`${repo.type}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <GitBranch className="h-4 w-4 shrink-0 text-neutral-500" />
                    <div className="min-w-0">
                      <p className="font-comfortaa text-xs font-semibold text-neutral-700">
                        {REPO_TYPE_LABELS[repo.type as RepoType]}
                      </p>
                      <p className="font-comfortaa truncate text-sm text-primary">
                        {repo.url}
                      </p>
                    </div>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-neutral-500 hover:text-primary"
                    aria-label="Abrir en nueva pestaña"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section icon={Code2} title="Tecnologías">
        {project.technologies.length === 0 ? (
          <p className="font-comfortaa text-sm text-neutral-500">
            Sin tecnologías registradas.
          </p>
        ) : (
          <div className="space-y-3">
            {techCategories.map((category) => {
              const items = project.technologies.filter(
                (tech) => tech.category === category,
              );
              if (items.length === 0) return null;
              const CatIcon = techCategoryIcons[category];
              return (
                <div key={category}>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <CatIcon className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="font-comfortaa text-xs font-semibold text-neutral-700">
                      {TECH_CATEGORY_LABELS[category]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((tech, index) => (
                      <span
                        key={`${tech.name}-${index}`}
                        className="font-comfortaa inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-primary"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section icon={ServerCog} title="Despliegue">
          <DetailRow
            label="Servicio"
            value={project.deploymentService || "—"}
          />
        </Section>

        <Section icon={ServerIcon} title="Servicios externos">
          {project.services.length === 0 ? (
            <p className="font-comfortaa text-sm text-neutral-500">
              Sin servicios.
            </p>
          ) : (
            <ul className="space-y-2">
              {project.services.map((service, index) => (
                <li
                  key={`${service.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-comfortaa text-sm font-medium text-primary">
                      {service.name}
                    </p>
                    {service.url && (
                      <p className="font-comfortaa truncate text-xs text-neutral-500">
                        {service.url}
                      </p>
                    )}
                  </div>
                  {service.url && (
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-neutral-500 hover:text-primary"
                      aria-label="Abrir en nueva pestaña"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      {project.infrastructure && (
        <Section icon={PencilRuler} title="Infraestructura">
          <pre className="font-comfortaa whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-primary">
            {project.infrastructure}
          </pre>
        </Section>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-comfortaa text-xs font-medium text-neutral-500">
        {label}
      </span>
      <span className="font-comfortaa text-sm text-primary">{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl border border-neutral-200 bg-secondary" />
      <div className="h-48 animate-pulse rounded-xl border border-neutral-200 bg-secondary" />
      <div className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-secondary" />
    </div>
  );
}

function DetailError({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div className="flex-1">
        <p className="font-comfortaa text-sm font-semibold text-red-700">
          No fue posible cargar el proyecto.
        </p>
        <p className="font-comfortaa mt-1 text-xs text-red-600">{message}</p>
        <div className="mt-3 flex gap-2">
          <CustomButton
            type="button"
            variant="outline"
            leftIcon={ArrowLeft}
            onClick={onBack}
          >
            Volver
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

function DetailNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 bg-secondary p-10 text-center">
      <p className="font-comfortaa text-sm text-neutral-500">
        No se encontró el proyecto solicitado.
      </p>
      <div className="mt-4 flex justify-center">
        <CustomButton
          type="button"
          variant="outline"
          leftIcon={ArrowLeft}
          onClick={onBack}
        >
          Volver a proyectos
        </CustomButton>
      </div>
    </div>
  );
}
