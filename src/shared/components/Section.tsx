import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ icon: Icon, title, children, className = "" }: SectionProps) {
  return (
    <section
      className={`space-y-4 rounded-xl border border-neutral-200 bg-secondary p-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <h3 className="font-comfortaa text-sm font-semibold text-primary">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}