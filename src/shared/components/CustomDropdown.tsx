import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
  icon?: LucideIcon;
  description?: string;
  disabled?: boolean;
}

export type CustomDropdownProps<T extends string | number> = {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
};

function initialHighlightFor<T extends string | number>(
  options: DropdownOption<T>[],
  value: T
): number {
  const idx = options.findIndex((o) => o.value === value);
  if (idx >= 0) return idx;
  return options.length > 0 ? 0 : -1;
}

function nextEnabledIndex(
  options: { disabled?: boolean }[],
  from: number,
  direction: 1 | -1
): number {
  if (options.length === 0) return -1;
  for (let step = 1; step <= options.length; step++) {
    const next =
      direction === 1
        ? (from + step) % options.length
        : (from - step + options.length) % options.length;
    if (!options[next]?.disabled) return next;
  }
  return from;
}

export function CustomDropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  disabled = false,
  className = "",
  id,
  name,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(() =>
    initialHighlightFor(options, value)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listboxId = id ? `${id}-listbox` : `${generatedId}-listbox`;
  const triggerId = id ?? generatedId;

  const selectedOption = options.find((o) => o.value === value);
  const SelectedIcon = selectedOption?.icon;

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((i) => nextEnabledIndex(options, i, 1));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((i) => nextEnabledIndex(options, i, -1));
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        if (highlightedIndex < 0) return;
        event.preventDefault();
        const option = options[highlightedIndex];
        if (option && !option.disabled) {
          setIsOpen(false);
          onChange(option.value);
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, options, highlightedIndex, onChange]);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setHighlightedIndex(initialHighlightFor(options, value));
    setIsOpen(true);
  }, [disabled, isOpen, options, value]);

  const selectOption = useCallback(
    (option: DropdownOption<T>, event?: ReactMouseEvent) => {
      if (option.disabled) return;
      event?.stopPropagation();
      event?.preventDefault();
      setIsOpen(false);
      onChange(option.value);
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={String(value)} />}

      <button
        type="button"
        id={triggerId}
        disabled={disabled}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={`font-comfortaa flex w-full items-center justify-between gap-2 rounded-lg border bg-secondary px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          disabled
            ? "cursor-not-allowed border-neutral-200 text-neutral-400"
            : isOpen
            ? "border-primary text-primary ring-2 ring-neutral-200"
            : "border-neutral-300 text-primary focus:border-primary focus:ring-neutral-200"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon && (
            <SelectedIcon className="h-4 w-4 shrink-0 text-neutral-500" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="font-comfortaa absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-neutral-200 bg-secondary py-1 shadow-lg"
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-neutral-500">
              Sin opciones
            </li>
          )}

          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            const OptionIcon = option.icon;

            return (
              <li
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onClick={(event) => selectOption(option, event)}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => {
                  if (!option.disabled) setHighlightedIndex(index);
                }}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                  option.disabled
                    ? "cursor-not-allowed text-neutral-300"
                    : isHighlighted
                    ? "bg-neutral-100 text-primary"
                    : "text-primary"
                }`}
              >
                {OptionIcon && (
                  <OptionIcon className="h-4 w-4 shrink-0 text-neutral-500" />
                )}
                <span className="flex-1 truncate">
                  {option.label}
                  {option.description && (
                    <span className="ml-1 text-xs text-neutral-500">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}