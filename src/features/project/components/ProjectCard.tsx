import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import {
  PROJECT_PRIORITY_LABELS,
  PROJECT_PRIORITY_TONES,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
} from "../constants/projectConstants";
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
      <div
        className="w-full h-1 bg-black mb-4 rounded-full"
        style={{
          backgroundColor: project.color ? `${project.color}` : undefined,
        }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
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

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${PROJECT_STATUS_TONES[project.status].dot}`}
          />
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
        <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${PROJECT_PRIORITY_TONES[project.priority].dot}`}
          />
          {PROJECT_PRIORITY_LABELS[project.priority]}
        </span>
      </div>
    </Link>
  );
}
