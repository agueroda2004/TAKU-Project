import { type ButtonHTMLAttributes, type Ref, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface CustomButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  children?: ReactNode;
}

const baseClasses =
  "font-comfortaa inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-secondary shadow-sm hover:bg-neutral-800 focus:ring-neutral-300",
  secondary:
    "border border-primary bg-secondary text-primary hover:bg-neutral-100 focus:ring-neutral-300",
  outline:
    "border border-neutral-300 bg-secondary text-primary hover:bg-neutral-50 focus:ring-neutral-200",
  ghost:
    "bg-transparent text-primary hover:bg-neutral-100 focus:ring-neutral-200",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-2.5 py-1.5",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-2.5",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function CustomButton({
  ref,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: CustomButtonProps) {
  const isDisabled = disabled || isLoading;
  const iconClass = iconSizeClasses[size];

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className={`${iconClass} animate-spin`} />
      ) : LeftIcon ? (
        <LeftIcon className={iconClass} />
      ) : null}
      {children}
      {!isLoading && RightIcon && <RightIcon className={iconClass} />}
    </button>
  );
}