import { Link } from "react-router-dom";
import { Star, FolderKanban } from "lucide-react";
import { PROJECT_STATUS_LABELS } from "../constants/projectConstants";
import type { ProjectListItem } from "../project";

interface ProjectCardProps {
  project: ProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-xl border border-neutral-200 bg-secondary p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {project.color ? (
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
              aria-hidden
            />
          ) : (
            <FolderKanban className="h-4 w-4 shrink-0 text-neutral-400" />
          )}
          <h3 className="font-comfortaa truncate text-sm font-semibold text-primary group-hover:underline">
            {project.name}
          </h3>
        </div>
        {project.isFavorite && (
          <Star
            className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400"
            aria-label="Favorito"
          />
        )}
      </div>

      {project.description && (
        <p className="font-comfortaa mt-2 line-clamp-2 text-xs text-neutral-500">
          {project.description}
        </p>
      )}

      <div className="mt-3">
        <span className="font-comfortaa inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
      </div>
    </Link>
  );
}
