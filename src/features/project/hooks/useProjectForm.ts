import { useReducer } from "react";
import type {
  ProjectPriority,
  ProjectStatus,
  TechCategory,
  RepoType,
} from "../project";

export interface ProjectFormState {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  isFavorite: boolean;
  color: string | null;
  icon: string | null;
  deploymentService: string;
  infrastructure: string;
  repositories: { type: RepoType; url: string }[];
  technologies: { name: string; category: TechCategory }[];
  services: { name: string; url: string }[];
}

const initialState: ProjectFormState = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  priority: "media",
  status: "idea",
  isFavorite: false,
  color: null,
  icon: null,
  deploymentService: "",
  infrastructure: "",
  repositories: [
    { type: "frontend", url: "" },
    { type: "backend", url: "" },
  ],
  technologies: [],
  services: [],
};

export type ProjectFormAction =
  | { type: "SET_NAME"; value: string }
  | { type: "SET_DESCRIPTION"; value: string }
  | { type: "SET_START_DATE"; value: string }
  | { type: "SET_END_DATE"; value: string }
  | { type: "SET_PRIORITY"; value: ProjectPriority }
  | { type: "SET_STATUS"; value: ProjectStatus }
  | { type: "TOGGLE_FAVORITE" }
  | { type: "SET_COLOR"; value: string | null }
  | { type: "SET_ICON"; value: string | null }
  | { type: "SET_DEPLOYMENT_SERVICE"; value: string }
  | { type: "SET_INFRASTRUCTURE"; value: string }
  | { type: "SET_REPO_URL"; repoType: RepoType; url: string }
  | { type: "ADD_TECHNOLOGY"; name: string; category: TechCategory }
  | { type: "REMOVE_TECHNOLOGY"; index: number }
  | { type: "ADD_SERVICE"; name: string; url: string }
  | { type: "REMOVE_SERVICE"; index: number }
  | { type: "RESET" };

function reducer(
  state: ProjectFormState,
  action: ProjectFormAction
): ProjectFormState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_DESCRIPTION":
      return { ...state, description: action.value };
    case "SET_START_DATE":
      return { ...state, startDate: action.value };
    case "SET_END_DATE":
      return { ...state, endDate: action.value };
    case "SET_PRIORITY":
      return { ...state, priority: action.value };
    case "SET_STATUS":
      return { ...state, status: action.value };
    case "TOGGLE_FAVORITE":
      return { ...state, isFavorite: !state.isFavorite };
    case "SET_COLOR":
      return { ...state, color: action.value };
    case "SET_ICON":
      return { ...state, icon: action.value };
    case "SET_DEPLOYMENT_SERVICE":
      return { ...state, deploymentService: action.value };
    case "SET_INFRASTRUCTURE":
      return { ...state, infrastructure: action.value };

    case "SET_REPO_URL":
      return {
        ...state,
        repositories: state.repositories.map((repo) =>
          repo.type === action.repoType ? { ...repo, url: action.url } : repo
        ),
      };

    case "ADD_TECHNOLOGY": {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      const exists = state.technologies.some(
        (tech) =>
          tech.name.toLowerCase() === trimmed.toLowerCase() &&
          tech.category === action.category
      );
      if (exists) return state;
      return {
        ...state,
        technologies: [
          ...state.technologies,
          { name: trimmed, category: action.category },
        ],
      };
    }

    case "REMOVE_TECHNOLOGY":
      return {
        ...state,
        technologies: state.technologies.filter(
          (_, index) => index !== action.index
        ),
      };

    case "ADD_SERVICE": {
      const trimmedName = action.name.trim();
      const trimmedUrl = action.url.trim();
      if (!trimmedName) return state;
      return {
        ...state,
        services: [
          ...state.services,
          { name: trimmedName, url: trimmedUrl },
        ],
      };
    }

    case "REMOVE_SERVICE":
      return {
        ...state,
        services: state.services.filter((_, index) => index !== action.index),
      };

    case "RESET":
      return initialState;
  }
}

export function useProjectForm(overrideInitial?: ProjectFormState) {
  return useReducer(reducer, overrideInitial ?? initialState);
}

export const projectFormInitialState = initialState;