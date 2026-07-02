import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import {
  MODULE_PRIORITY_LABELS,
  MODULE_STATUS_LABELS,
} from "../constants/moduleConstants";
import { PROJECT_ICON_MAP } from "../../project/constants/projectPalette";
import type { ModuleListItem } from "../module";

interface ModuleCardProps {
  module: ModuleListItem;
  projectId: string;
}

export default function ModuleCard({ module, projectId }: ModuleCardProps) {
  const Icon = module.icon ? PROJECT_ICON_MAP[module.icon] : undefined;
  const DisplayIcon = Icon ?? Package;

  return (
    <Link
      to={`/projects/${projectId}/modules/${module.id}`}
      className="group block rounded-xl border border-neutral-200 bg-secondary p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
    >
      <div className="flex items-start gap-3">
        {module.color ? (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${module.color}1a` }}
          >
            <DisplayIcon
              className="h-4 w-4"
              style={{ color: module.color }}
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
            <DisplayIcon className="h-4 w-4 text-neutral-500" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-comfortaa truncate text-sm font-semibold text-primary group-hover:underline">
            {module.name}
          </h3>
          {module.description && (
            <p className="font-comfortaa mt-0.5 line-clamp-2 text-xs text-neutral-500">
              {module.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="font-comfortaa inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
          {MODULE_STATUS_LABELS[module.status]}
        </span>
        <span className="font-comfortaa inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
          {MODULE_PRIORITY_LABELS[module.priority]}
        </span>
      </div>
    </Link>
  );
}