import { ArrowRight, AlertCircle } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
} from "../constants/projectConstants";
import type { ProjectStatus } from "../project";

interface ChangeStatusModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  projectName: string;
  currentStatus: ProjectStatus;
  nextStatus: ProjectStatus;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChangeStatusModal({
  isOpen,
  isUpdating,
  projectName,
  currentStatus,
  nextStatus,
  onClose,
  onConfirm,
}: ChangeStatusModalProps) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar estado del proyecto"
      size="sm"
      closeOnBackdrop={!isUpdating}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
          <p className="font-comfortaa text-sm text-primary">
            ¿Estás seguro que deseas cambiar el proyecto{" "}
            <span className="font-semibold">{projectName}</span> al siguiente
            estado{" "}
            <span className="font-semibold">
              {PROJECT_STATUS_LABELS[nextStatus]}
            </span>
            ?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-secondary p-3">
          <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${PROJECT_STATUS_TONES[currentStatus].dot}`}
            />
            {PROJECT_STATUS_LABELS[currentStatus]}
          </span>
          <ArrowRight className="h-4 w-4 text-neutral-500" />
          <span className="font-comfortaa inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${PROJECT_STATUS_TONES[nextStatus].dot}`}
            />
            {PROJECT_STATUS_LABELS[nextStatus]}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
            leftIcon={ArrowRight}
            isLoading={isUpdating}
            onClick={onConfirm}
          >
            {isUpdating ? "Actualizando..." : "Sí, cambiar"}
          </CustomButton>
        </div>
      </div>
    </Overlay>
  );
}