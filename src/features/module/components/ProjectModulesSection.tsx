import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Plus } from "lucide-react";
import ModuleCard from "./ModuleCard";
import CreateModuleModal from "./CreateModuleModal";
import { useModules } from "../hooks/useModule";
import type { ModuleListItem } from "../module";

interface ProjectModulesSectionProps {
  projectId: string;
  limit?: number;
}

export default function ProjectModulesSection({
  projectId,
  limit = 3,
}: ProjectModulesSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: modules, isLoading } = useModules(projectId, { limit });

  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-neutral-500" />
          <h3 className="font-comfortaa text-sm font-semibold text-primary">
            Módulos
          </h3>
          {!isLoading && modules && modules.length > 0 && (
            <span className="font-comfortaa rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {modules.length}
              {modules.length === limit ? "+" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="font-comfortaa inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo módulo
          </button>
          <Link
            to={`/projects/${projectId}/modules`}
            className="font-comfortaa inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition hover:text-primary"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <ModulesSectionBody
        modules={modules}
        isLoading={isLoading}
        projectId={projectId}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      <CreateModuleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectId={projectId}
      />
    </section>
  );
}

interface ModulesSectionBodyProps {
  modules: ModuleListItem[] | undefined;
  isLoading: boolean;
  projectId: string;
  onCreateClick: () => void;
}

function ModulesSectionBody({
  modules,
  isLoading,
  projectId,
  onCreateClick,
}: ModulesSectionBodyProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
          />
        ))}
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <button
        type="button"
        onClick={onCreateClick}
        className="block w-full rounded-xl border border-dashed border-neutral-200 bg-secondary p-6 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
      >
        <Package className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="font-comfortaa mt-2 text-sm text-neutral-500">
          Aún no hay módulos en este proyecto.
        </p>
        <p className="font-comfortaa mt-1 text-xs font-semibold text-primary">
          Crear el primero
        </p>
      </button>
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