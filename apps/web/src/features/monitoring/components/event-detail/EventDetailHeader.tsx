import { useNavigate } from "react-router";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";

interface EventDetailHeaderProps {
  eventId: string;
}

export default function EventDetailHeader({ eventId }: EventDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-surface-page relative flex h-[56px] shrink-0 items-center border-b border-[#cad5e2] px-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] sm:px-6">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-dashboard-subtitle hover:text-dashboard-title flex items-center gap-2 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="hidden text-[14px] font-semibold tracking-[0.55px] sm:inline">
          뒤로가기
        </span>
      </button>

      {/* 중앙: 페이지 타이틀 + 이벤트 ID */}
      <div className="ml-auto flex flex-col items-center gap-[2px] sm:absolute sm:left-1/2 sm:ml-0 sm:-translate-x-1/2">
        <span className="text-monitor-text-muted font-mono text-[10px] tracking-[1px] uppercase">
          이상 행동 상세 검토
        </span>
        <span className="text-dashboard-title text-[12px] font-bold tracking-[-0.15px] sm:text-[14px]">
          {eventId}
        </span>
      </div>

      {/* 하단 blue gradient 라인 */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-[rgba(43,127,255,0.5)] via-[rgba(81,162,255,0.5)] to-transparent" />
    </header>
  );
}
