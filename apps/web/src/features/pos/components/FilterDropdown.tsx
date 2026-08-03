import { useRef } from "react";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface FilterDropdownProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  open,
  onToggle,
  onClose,
}: FilterDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useClickOutside(ref, onClose, open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="border-monitor-border bg-monitor-card-bg text-monitor-text flex h-10 items-center gap-2 rounded-control border px-3 text-13 font-medium whitespace-nowrap transition-colors hover:bg-white/5"
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon
          className={`text-monitor-text-dim ml-1 h-[14px] w-[14px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-monitor-border bg-monitor-card-bg absolute top-[calc(100%+4px)] right-0 z-50 min-w-[120px] rounded-control border py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                onClose();
              }}
              className={`flex w-full items-center px-3 py-2 text-left text-13 transition-colors ${
                opt.value === value
                  ? "text-monitor-accent-blue bg-monitor-accent-blue/10"
                  : "text-monitor-text hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
