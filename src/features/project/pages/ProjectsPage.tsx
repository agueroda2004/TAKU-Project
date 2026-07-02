import { useState } from "react";
import ProjectsHeader from "../components/ProjectsHeader";
import ProjectsFilters from "../components/ProjectsFilters";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { useProjects } from "../hooks/useProject";
import { useProjectFilters } from "../hooks/useProjectFilters";
import type { ProjectListItem } from "../project";

export default function ProjectsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { filters } = useProjectFilters();
  const { data: projects, isLoading, isError, error } = useProjects(filters);

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ProjectsHeader onNewProject={() => setIsCreateOpen(true)} />
        <ProjectsFilters />

        <ProjectsList
          projects={projects}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
        />

        <CreateProjectModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </div>
    </div>
  );
}

interface ProjectsListProps {
  projects: ProjectListItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

function ProjectsList({
  projects,
  isLoading,
  isError,
  errorMessage,
}: ProjectsListProps) {
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
        <p className="font-comfortaa text-sm font-semibold text-red-700">
          No fue posible cargar los proyectos.
        </p>
        {errorMessage && (
          <p className="font-comfortaa mt-1 text-xs text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-secondary p-10 text-center">
        <p className="font-comfortaa text-sm text-neutral-500">
          No se encontraron proyectos con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
