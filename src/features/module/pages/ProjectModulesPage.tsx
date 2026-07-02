import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Package, Plus } from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import CreateModuleModal from "../components/CreateModuleModal";
import { CustomButton } from "../../../shared/components/CustomButton";
import { useModules } from "../hooks/useModule";
import { useProject } from "../../project/hooks/useProject";
import type { ModuleListItem } from "../module";

export default function ProjectModulesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: modules, isLoading, isError, error } = useModules(projectId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isProjectLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-comfortaa text-sm text-neutral-500">Cargando…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/projects"
            className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a proyectos
          </Link>
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-secondary p-10 text-center">
            <p className="font-comfortaa text-sm text-neutral-500">
              No se encontró el proyecto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`/projects/${project.id}`}
              className="font-comfortaa inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al proyecto
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-neutral-500" />
              <h1 className="font-comfortaa text-2xl font-bold text-primary">
                Módulos
              </h1>
            </div>
            <p className="font-comfortaa mt-1 text-sm text-neutral-500">
              Módulos del proyecto{" "}
              <span className="font-medium text-primary">{project.name}</span>
            </p>
          </div>
          <CustomButton leftIcon={Plus} onClick={() => setIsCreateOpen(true)}>
            Nuevo módulo
          </CustomButton>
        </div>

        <ModulesList
          modules={modules}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          projectId={project.id}
        />

        <CreateModuleModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          projectId={project.id}
        />
      </div>
    </div>
  );
}

interface ModulesListProps {
  modules: ModuleListItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  projectId: string;
}

function ModulesList({
  modules,
  isLoading,
  isError,
  errorMessage,
  projectId,
}: ModulesListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-secondary"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-comfortaa text-sm font-semibold text-red-700">
              No fue posible cargar los módulos.
            </p>
            {errorMessage && (
              <p className="font-comfortaa mt-1 text-xs text-red-600">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-secondary p-10 text-center">
        <Package className="mx-auto h-10 w-10 text-neutral-300" />
        <p className="font-comfortaa mt-3 text-sm text-neutral-500">
          Este proyecto aún no tiene módulos.
        </p>
        <p className="font-comfortaa mt-1 text-xs text-neutral-400">
          Crea el primero con el botón{" "}
          <span className="font-semibold text-primary">Nuevo módulo</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} projectId={projectId} />
      ))}
    </div>
  );
}
