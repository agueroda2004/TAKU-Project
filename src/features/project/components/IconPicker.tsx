import { memo } from "react";
import { PROJECT_ICONS } from "../constants/projectPalette";

interface IconPickerProps {
  value: string | null;
  onSelect: (value: string | null) => void;
}

function IconPickerImpl({ value, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
      {PROJECT_ICONS.map((entry) => {
        const Icon = entry.icon;
        const selected = value === entry.name;
        return (
          <button
            key={entry.name}
            type="button"
            onClick={() => onSelect(selected ? null : entry.name)}
            aria-label={entry.label}
            aria-pressed={selected}
            title={entry.label}
            className={`flex aspect-square items-center justify-center rounded-lg border-2 transition ${
              selected
                ? "border-primary bg-neutral-100"
                : "border-neutral-200 bg-secondary hover:border-neutral-400"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                selected ? "text-primary" : "text-neutral-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export const IconPicker = memo(IconPickerImpl);