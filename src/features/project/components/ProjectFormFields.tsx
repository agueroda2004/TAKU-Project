import { useState, type ReactNode } from "react";
import {
  Plus,
  Star,
  Trash2,
  X,
  ServerCog,
  Boxes,
  Link2,
  Cloud,
  Code2,
  Database,
  PencilRuler,
} from "lucide-react";
import { Section } from "../../../shared/components/Section";
import { CustomButton } from "../../../shared/components/CustomButton";
import { CustomDropdown } from "../../../shared/components/CustomDropdown";
import {
  PROJECT_PRIORITY_LABELS,
  PROJECT_STATUS_LABELS,
  TECH_CATEGORY_LABELS,
  REPO_TYPE_LABELS,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from "../constants/projectConstants";
import { PROJECT_COLORS, PROJECT_COLOR_LABELS } from "../constants/projectPalette";
import { IconPicker } from "./IconPicker";
import type { ProjectFieldErrors } from "../schemas/projectSchema";
import type {
  ProjectFormAction,
  ProjectFormState,
} from "../hooks/useProjectForm";
import type {
  ProjectPriority,
  ProjectStatus,
  RepoType,
  TechCategory,
} from "../project";

const techCategories: TechCategory[] = ["frontend", "backend", "database"];

const techCategoryIcons: Record<TechCategory, typeof Code2> = {
  frontend: Code2,
  backend: ServerCog,
  database: Database,
};

interface ProjectFormFieldsProps {
  state: ProjectFormState;
  dispatch: React.Dispatch<ProjectFormAction>;
  errors: ProjectFieldErrors;
  onIconSelect: (value: string | null) => void;
}

export function ProjectFormFields({
  state,
  dispatch,
  errors,
  onIconSelect,
}: ProjectFormFieldsProps) {
  return (
    <>
      <Section icon={PencilRuler} title="Información básica">
        <div className="space-y-3">
          <Field
            label="Nombre"
            required
            error={errors.name}
            input={
              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", value: e.target.value })
                }
                placeholder="Mi proyecto"
                className={inputClass(Boolean(errors.name))}
              />
            }
          />
          <Field
            label="Descripción"
            error={errors.description}
            input={
              <textarea
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_DESCRIPTION",
                    value: e.target.value,
                  })
                }
                placeholder="¿De qué trata el proyecto?"
                rows={4}
                className={inputClass(Boolean(errors.description))}
              />
            }
          />
        </div>
      </Section>

      <Section icon={Boxes} title="Fechas, prioridad y estado">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Fecha de inicio"
            required
            error={errors.startDate}
            input={
              <input
                type="date"
                value={state.startDate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_START_DATE",
                    value: e.target.value,
                  })
                }
                className={inputClass(Boolean(errors.startDate))}
              />
            }
          />
          <Field
            label="Fecha de fin"
            error={errors.endDate}
            input={
              <input
                type="date"
                value={state.endDate}
                onChange={(e) =>
                  dispatch({ type: "SET_END_DATE", value: e.target.value })
                }
                className={inputClass(Boolean(errors.endDate))}
              />
            }
          />
          <Field
            label="Prioridad"
            input={
              <CustomDropdown<ProjectPriority>
                options={PROJECT_PRIORITIES.map((value) => ({
                  value,
                  label: PROJECT_PRIORITY_LABELS[value],
                }))}
                value={state.priority}
                onChange={(value) =>
                  dispatch({ type: "SET_PRIORITY", value })
                }
              />
            }
          />
          <Field
            label="Estado"
            input={
              <CustomDropdown<ProjectStatus>
                options={PROJECT_STATUSES.map((value) => ({
                  value,
                  label: PROJECT_STATUS_LABELS[value],
                }))}
                value={state.status}
                onChange={(value) => dispatch({ type: "SET_STATUS", value })}
              />
            }
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_FAVORITE" })}
            aria-label={
              state.isFavorite
                ? "Quitar de favoritos"
                : "Marcar como favorito"
            }
            aria-pressed={state.isFavorite}
            title={
              state.isFavorite
                ? "Quitar de favoritos"
                : "Marcar como favorito"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-secondary transition hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <Star
              className={`h-5 w-5 transition ${
                state.isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-neutral-400"
              }`}
            />
          </button>
          <span className="font-comfortaa text-sm text-neutral-600">
            {state.isFavorite
              ? "Marcado como favorito"
              : "Marcar como favorito"}
          </span>
        </div>
      </Section>

      <Section icon={PencilRuler} title="Apariencia">
        <Field
          label="Color"
          description="Elige un color para identificar el proyecto."
          input={
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((color) => {
                const selected = state.color === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_COLOR", value: color })
                    }
                    aria-label={PROJECT_COLOR_LABELS[color] ?? color}
                    aria-pressed={selected}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      selected
                        ? "border-primary scale-110"
                        : "border-neutral-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
              {state.color && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_COLOR", value: null })}
                  className="font-comfortaa flex items-center gap-1 rounded-md border border-neutral-200 bg-secondary px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                >
                  <X className="h-3 w-3" />
                  Quitar
                </button>
              )}
            </div>
          }
        />

        <Field
          label="Icono"
          description="Selecciona un icono representativo. Toca de nuevo para quitar la selección."
          input={<IconPicker value={state.icon} onSelect={onIconSelect} />}
        />
      </Section>

      <Section icon={Code2} title="Tecnologías">
        <div className="space-y-4">
          {techCategories.map((category) => (
            <TechCategoryField
              key={category}
              category={category}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </div>
      </Section>

      <Section icon={Link2} title="Repositorios">
        <div className="grid gap-4 sm:grid-cols-2">
          {state.repositories.map((repo) => (
            <Field
              key={repo.type}
              label={`URL repositorio ${REPO_TYPE_LABELS[repo.type as RepoType].toLowerCase()}`}
              input={
                <input
                  type="url"
                  value={repo.url}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_REPO_URL",
                      repoType: repo.type as RepoType,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://github.com/usuario/repo"
                  className={inputClass(false)}
                />
              }
            />
          ))}
        </div>
      </Section>

      <Section icon={Cloud} title="Despliegue e infraestructura">
        <Field
          label="Servicio de despliegue"
          error={errors.deploymentService}
          description="Plataforma principal donde se publica el proyecto (Vercel, Railway, etc.)."
          input={
            <input
              type="text"
              value={state.deploymentService}
              onChange={(e) =>
                dispatch({
                  type: "SET_DEPLOYMENT_SERVICE",
                  value: e.target.value,
                })
              }
              placeholder="Vercel, Railway, AWS…"
              className={inputClass(Boolean(errors.deploymentService))}
            />
          }
        />
        <Field
          label="Infraestructura"
          error={errors.infrastructure}
          description="Notas libres sobre la arquitectura, puedes usar símbolos y saltos de línea."
          input={
            <textarea
              value={state.infrastructure}
              onChange={(e) =>
                dispatch({
                  type: "SET_INFRASTRUCTURE",
                  value: e.target.value,
                })
              }
              rows={4}
              placeholder={"- Front: Vercel\n- DB: Supabase\n- Auth: Clerk"}
              className={`${inputClass(Boolean(errors.infrastructure))} font-mono`}
            />
          }
        />
      </Section>

      <Section icon={ServerCog} title="Servicios externos">
        <ServicesField state={state} dispatch={dispatch} />
      </Section>
    </>
  );
}

function Field({
  label,
  required,
  description,
  error,
  input,
}: {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  input: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-comfortaa text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {input}
      {description && !error && (
        <span className="font-comfortaa text-xs text-neutral-500">
          {description}
        </span>
      )}
      {error && (
        <span className="font-comfortaa text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean): string {
  return `font-comfortaa w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-primary outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
  }`;
}

function TechCategoryField({
  category,
  state,
  dispatch,
}: {
  category: TechCategory;
  state: ProjectFormState;
  dispatch: React.Dispatch<ProjectFormAction>;
}) {
  const [draft, setDraft] = useState("");
  const Icon = techCategoryIcons[category];
  const items = state.technologies
    .map((tech, index) => ({ tech, index }))
    .filter((entry) => entry.tech.category === category);

  function handleAdd() {
    if (!draft.trim()) return;
    dispatch({ type: "ADD_TECHNOLOGY", name: draft, category });
    setDraft("");
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <span className="font-comfortaa text-sm font-semibold text-primary">
          {TECH_CATEGORY_LABELS[category]}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Ej. React, Node.js, PostgreSQL…"
          className={inputClass(false)}
        />
        <CustomButton
          type="button"
          variant="secondary"
          size="md"
          onClick={handleAdd}
          leftIcon={Plus}
          disabled={!draft.trim()}
        >
          Agregar
        </CustomButton>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map(({ tech, index }) => (
            <span
              key={`${tech.name}-${index}`}
              className="font-comfortaa inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-primary"
            >
              {tech.name}
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_TECHNOLOGY", index })}
                className="text-neutral-500 hover:text-red-500"
                aria-label={`Quitar ${tech.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ServicesField({
  state,
  dispatch,
}: {
  state: ProjectFormState;
  dispatch: React.Dispatch<ProjectFormAction>;
}) {
  const [draftName, setDraftName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  function handleAdd() {
    if (!draftName.trim()) return;
    dispatch({
      type: "ADD_SERVICE",
      name: draftName,
      url: draftUrl,
    });
    setDraftName("");
    setDraftUrl("");
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Nombre (ImageKit, Clerk…)"
          className={inputClass(false)}
        />
        <input
          type="url"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="https://…"
          className={inputClass(false)}
        />
        <CustomButton
          type="button"
          variant="secondary"
          onClick={handleAdd}
          leftIcon={Plus}
          disabled={!draftName.trim()}
        >
          Agregar
        </CustomButton>
      </div>

      {state.services.length > 0 && (
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {state.services.map((service, index) => (
            <li
              key={`${service.name}-${index}`}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="font-comfortaa truncate text-sm font-medium text-primary">
                  {service.name}
                </p>
                {service.url && (
                  <p className="font-comfortaa truncate text-xs text-neutral-500">
                    {service.url}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_SERVICE", index })}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-red-500"
                aria-label={`Quitar ${service.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}