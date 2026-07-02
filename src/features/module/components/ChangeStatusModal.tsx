import { ArrowRight, AlertCircle } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";

interface ChangeStatusModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  moduleName: string;
  currentStatusLabel: string;
  nextStatusLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChangeStatusModal({
  isOpen,
  isUpdating,
  moduleName,
  currentStatusLabel,
  nextStatusLabel,
  onClose,
  onConfirm,
}: ChangeStatusModalProps) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar estado del módulo"
      size="sm"
      closeOnBackdrop={!isUpdating}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
          <p className="font-comfortaa text-sm text-primary">
            ¿Estás seguro que deseas cambiar el módulo{" "}
            <span className="font-semibold">{moduleName}</span> al siguiente
            estado{" "}
            <span className="font-semibold">{nextStatusLabel}</span>?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-secondary p-3">
          <span className="font-comfortaa rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            {currentStatusLabel}
          </span>
          <ArrowRight className="h-4 w-4 text-neutral-500" />
          <span className="font-comfortaa rounded-full bg-primary px-3 py-1 text-xs font-semibold text-secondary">
            {nextStatusLabel}
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