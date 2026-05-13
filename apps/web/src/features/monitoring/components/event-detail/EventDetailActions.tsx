import CheckCircleIcon from "@/assets/icons/check-circle.svg?react";
import SirenIcon from "@/assets/icons/siren.svg?react";

interface EventDetailActionsProps {
  onDismiss?: () => void;
  onAlert?: () => void;
}

export default function EventDetailActions({
  onDismiss,
  onAlert,
}: EventDetailActionsProps) {
  return (
    <div className="shrink-0 border-t border-monitor-border bg-monitor-card-bg px-4 py-3 sm:px-6 sm:py-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <button
          onClick={onDismiss}
          className="flex items-center justify-center gap-2 rounded-[12px] border border-monitor-border bg-monitor-bg px-4 py-3 transition-colors hover:border-monitor-border-strong hover:bg-monitor-border"
        >
          <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#cad5e2]" />
          <span className="text-[12px] font-bold tracking-[0.3px] text-[#cad5e2]">
            정상 확인 (오탐)
          </span>
        </button>

        <button
          onClick={onAlert}
          className="flex items-center justify-center gap-2 rounded-[12px] bg-[#e7000b] px-4 py-3 text-white shadow-[0_4px_15px_rgba(239,68,68,0.2)] transition-opacity hover:opacity-90"
        >
          <SirenIcon className="h-5 w-5 shrink-0" />
          <span className="text-[12px] font-bold tracking-[0.3px]">
            경고 방송 및 녹화 보존
          </span>
        </button>
      </div>
    </div>
  );
}
