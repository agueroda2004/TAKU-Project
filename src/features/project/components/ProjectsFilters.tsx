import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { CustomButton } from "../../../shared/components/CustomButton";
import { CustomDropdown } from "../../../shared/components/CustomDropdown";
import {
  PROJECT_PRIORITIES,
  PROJECT_PRIORITY_LABELS,
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
} from "../constants/projectConstants";
import {
  useProjectFilters,
  projectFiltersInitialState,
} from "../hooks/useProjectFilters";
import type {
  ProjectFavoriteFilter,
  ProjectFiltersState,
  ProjectPriorityFilter,
  ProjectStatusFilter,
} from "../project";

const favoriteOptions: { value: ProjectFavoriteFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "favorites", label: "Solo favoritos" },
];

const priorityOptions: { value: ProjectPriorityFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  ...PROJECT_PRIORITIES.map((value) => ({
    value,
    label: PROJECT_PRIORITY_LABELS[value],
  })),
];

const statusOptions: { value: ProjectStatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  ...PROJECT_STATUSES.map((value) => ({
    value,
    label: PROJECT_STATUS_LABELS[value],
  })),
];

export default function ProjectsFilters() {
  const { filters, applyFilters, clearFilters } = useProjectFilters();
  const [draft, setDraft] = useState<ProjectFiltersState>(filters);

  function handleApply() {
    applyFilters(draft);
  }

  function handleClear() {
    setDraft(projectFiltersInitialState);
    clearFilters();
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-secondary p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 lg:col-span-2">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Nombre
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={draft.name}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Buscar por nombre…"
              className="font-comfortaa w-full rounded-lg border border-neutral-300 bg-secondary py-2 pl-10 pr-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-neutral-200"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Prioridad
          </span>
          <CustomDropdown<ProjectPriorityFilter>
            options={priorityOptions}
            value={draft.priority}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, priority: value }))
            }
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Estado
          </span>
          <CustomDropdown<ProjectStatusFilter>
            options={statusOptions}
            value={draft.status}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, status: value }))
            }
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Favorito
          </span>
          <CustomDropdown<ProjectFavoriteFilter>
            options={favoriteOptions}
            value={draft.favorite}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, favorite: value }))
            }
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Fecha de inicio desde
          </span>
          <input
            type="date"
            value={draft.startDateFrom}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, startDateFrom: e.target.value }))
            }
            className="font-comfortaa w-full rounded-lg border border-neutral-300 bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-neutral-200"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-comfortaa text-xs font-medium text-neutral-600">
            Fecha de inicio hasta
          </span>
          <input
            type="date"
            value={draft.startDateTo}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, startDateTo: e.target.value }))
            }
            className="font-comfortaa w-full rounded-lg border border-neutral-300 bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-neutral-200"
          />
        </label>

        <div className="flex items-end gap-2">
          <CustomButton
            type="button"
            variant="primary"
            leftIcon={Filter}
            onClick={handleApply}
            fullWidth
          >
            Filtrar
          </CustomButton>
          <CustomButton
            type="button"
            variant="outline"
            leftIcon={X}
            onClick={handleClear}
          >
            Limpiar
          </CustomButton>
        </div>
      </div>
    </div>
  );
}