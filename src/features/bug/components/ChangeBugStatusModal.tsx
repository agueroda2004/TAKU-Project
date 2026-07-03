import { Check } from "lucide-react";
import Overlay from "../../../shared/components/Overlay";
import { CustomButton } from "../../../shared/components/CustomButton";
import {
  BUG_STATUSES,
  BUG_STATUS_LABELS,
  BUG_STATUS_TONES,
} from "../constants/bugConstants";
import type { BugStatus } from "../bug";

interface ChangeBugStatusModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  bugName: string;
  currentStatus: BugStatus;
  onClose: () => void;
  onConfirm: (nextStatus: BugStatus) => void;
}

export default function ChangeBugStatusModal({
  isOpen,
  isUpdating,
  bugName,
  currentStatus,
  onClose,
  onConfirm,
}: ChangeBugStatusModalProps) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar estado del bug"
      size="sm"
      closeOnBackdrop={!isUpdating}
    >
      <div className="space-y-4">
        <p className="font-comfortaa text-sm text-primary">
          Elegí el nuevo estado para{" "}
          <span className="font-semibold">{bugName}</span>:
        </p>

        <div className="space-y-1.5">
          {BUG_STATUSES.map((status) => {
            const isCurrent = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                disabled={isCurrent || isUpdating}
                onClick={() => onConfirm(status)}
                className={`font-comfortaa flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                  isCurrent
                    ? "cursor-default border-primary bg-primary/5"
                    : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-3 w-3 shrink-0 rounded-full ${BUG_STATUS_TONES[status].dot}`}
                />
                <span className="flex-1 text-left font-medium text-primary">
                  {BUG_STATUS_LABELS[status]}
                </span>
                {isCurrent && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-200 pt-3">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cerrar
          </CustomButton>
        </div>
      </div>
    </Overlay>
  );
}