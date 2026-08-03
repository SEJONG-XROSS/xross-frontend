import { cn } from "@xross/core";

interface SettingsRowProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export default function SettingsRow({
  label,
  description,
  children,
  hasBorder = true,
  className,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 sm:px-5",
        description
          ? "min-h-[70px] py-3 lg:h-[75px] lg:py-0"
          : "min-h-[52px] py-3 lg:h-[57px] lg:py-0",
        hasBorder && "border-b border-monitor-border",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-monitor-text text-14">
          {label}
        </span>
        {description && (
          <span className="text-monitor-text-dim text-12">
            {description}
          </span>
        )}
      </div>
      {children && (
        <div className="shrink-0 text-right">{children}</div>
      )}
    </div>
  );
}
