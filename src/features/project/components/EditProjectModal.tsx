import { useCallback, useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  projectSchema,
  formatProjectErrors,
  type ProjectFieldErrors,
} from "../schemas/projectSchema";
import { useProjectForm } from "../hooks/useProjectForm";
import { useUpdateProject } from "../hooks/useProject";
import { ProjectFormFields } from "./ProjectFormFields";
import type { Project, RepoType } from "../project";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

function projectToFormState(project: Project) {
  const existingRepos = new Map(
    project.repositories.map((r) => [r.type as RepoType, r.url])
  );

  return {
    name: project.name,
    description: project.description ?? "",
    startDate: project.startDate,
    endDate: project.endDate ?? "",
    priority: project.priority,
    status: project.status,
    isFavorite: project.isFavorite,
    color: project.color,
    icon: project.icon,
    deploymentService: project.deploymentService ?? "",
    infrastructure: project.infrastructure ?? "",
    repositories: (["frontend", "backend"] as const).map((type) => ({
      type,
      url: existingRepos.get(type) ?? "",
    })),
    technologies: project.technologies,
    services: project.services.map((svc) => ({
      name: svc.name,
      url: svc.url ?? "",
    })),
  };
}

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const [state, dispatch] = useProjectForm(projectToFormState(project));
  const [errors, setErrors] = useState<ProjectFieldErrors>({});
  const { mutate: updateProject, isPending } = useUpdateProject();

  const handleIconSelect = useCallback(
    (value: string | null) => dispatch({ type: "SET_ICON", value }),
    [dispatch]
  );

  function handleClose() {
    if (isPending) return;
    setErrors({});
    onClose();
  }

  function buildPayload() {
    return {
      name: state.name,
      description: state.description,
      startDate: state.startDate,
      endDate: state.endDate,
      priority: state.priority,
      status: state.status,
      isFavorite: state.isFavorite,
      color: state.color,
      icon: state.icon,
      deploymentService: state.deploymentService,
      infrastructure: state.infrastructure,
      repositories: state.repositories
        .filter((repo) => repo.url.trim().length > 0)
        .map((repo) => ({ type: repo.type, url: repo.url.trim() })),
      technologies: state.technologies,
      services: state.services
        .filter((svc) => svc.name.trim().length > 0)
        .map((svc) => ({ name: svc.name.trim(), url: svc.url.trim() })),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const payload = buildPayload();
    const result = projectSchema.safeParse(payload);

    if (!result.success) {
      setErrors(formatProjectErrors(result.error));
      notify.error("Revisa los campos del formulario.");
      return;
    }

    updateProject(
      { id: project.id, input: result.data },
      {
        onSuccess: () => {
          notify.success("Proyecto actualizado correctamente.");
          handleClose();
        },
        onError: (err) => {
          notify.error(
            err.message || "No fue posible actualizar el proyecto."
          );
        },
      }
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar proyecto"
      description="Modifica los datos del proyecto. Los cambios se guardan al confirmar."
      size="full"
      closeOnBackdrop={!isPending}
      className="!flex !flex-col !overflow-hidden !p-0"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-1 flex-col min-h-0"
      >
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <ProjectFormFields
            state={state}
            dispatch={dispatch}
            errors={errors}
            onIconSelect={handleIconSelect}
          />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-neutral-200 bg-secondary px-6 py-4">
          <CustomButton
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="submit"
            isLoading={isPending}
            leftIcon={Pencil}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </CustomButton>
        </div>
      </form>
    </Overlay>
  );
}