import { useCallback, useSyncExternalStore } from "react";
import type { ProjectFiltersState } from "../project";

const initialFilters: ProjectFiltersState = {
  name: "",
  priority: "all",
  status: "all",
  favorite: "all",
  startDateFrom: "",
  startDateTo: "",
};

let state: ProjectFiltersState = initialFilters;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initialFilters;
}

export function useProjectFilters() {
  const filters = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const applyFilters = useCallback((next: ProjectFiltersState) => {
    if (state === next) return;
    state = next;
    emit();
  }, []);

  const clearFilters = useCallback(() => {
    state = initialFilters;
    emit();
  }, []);

  return { filters, applyFilters, clearFilters };
}

export const projectFiltersInitialState = initialFilters;