import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type OverlaySize = "sm" | "md" | "lg" | "xl" | "full";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: OverlaySize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  className?: string;
}

const sizeClasses: Record<OverlaySize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

export default function Overlay({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  className = "",
}: OverlayProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? undefined : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => {
        if (closeOnBackdrop) onClose();
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`font-comfortaa relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-secondary p-6 shadow-2xl ${className}`}
      >
        {(title || !hideCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4 px-4 py-2">
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-lg font-bold text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-neutral-500">{description}</p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="shrink-0 rounded-md p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
