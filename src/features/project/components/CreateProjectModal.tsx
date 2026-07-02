import { useCallback, useState, type FormEvent } from "react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import { notify } from "../../../shared/utils/notify";
import {
  projectSchema,
  formatProjectErrors,
  type ProjectFieldErrors,
} from "../schemas/projectSchema";
import { useProjectForm } from "../hooks/useProjectForm";
import { useCreateProject } from "../hooks/useProject";
import { ProjectFormFields } from "./ProjectFormFields";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [state, dispatch] = useProjectForm();
  const [errors, setErrors] = useState<ProjectFieldErrors>({});
  const { mutate: createProject, isPending } = useCreateProject();

  const handleIconSelect = useCallback(
    (value: string | null) => dispatch({ type: "SET_ICON", value }),
    [dispatch],
  );

  function handleClose() {
    if (isPending) return;
    dispatch({ type: "RESET" });
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

    createProject(result.data, {
      onSuccess: () => {
        notify.success("Proyecto creado correctamente.");
        handleClose();
      },
      onError: (err) => {
        notify.error(err.message || "No fue posible crear el proyecto.");
      },
    });
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo proyecto"
      description="Completa los datos del proyecto. Los campos opcionales puedes dejarlos vacíos."
      size="full"
      closeOnBackdrop={!isPending}
      className="flex! flex-col! overflow-hidden! p-0!"
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
          <CustomButton type="submit" isLoading={isPending}>
            {isPending ? "Creando..." : "Crear proyecto"}
          </CustomButton>
        </div>
      </form>
    </Overlay>
  );
}
