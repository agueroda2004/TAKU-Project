import { Plus } from "lucide-react";
import { CustomButton } from "../../../shared/components/CustomButton";

interface ProjectsHeaderProps {
  onNewProject: () => void;
}

export default function ProjectsHeader({ onNewProject }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-comfortaa text-2xl font-bold text-primary">
          Proyectos
        </h1>
        <p className="font-comfortaa text-sm text-neutral-500">
          Gestiona tus proyectos, tecnologías y servicios asociados.
        </p>
      </div>
      <CustomButton leftIcon={Plus} onClick={onNewProject}>
        Nuevo proyecto
      </CustomButton>
    </div>
  );
}