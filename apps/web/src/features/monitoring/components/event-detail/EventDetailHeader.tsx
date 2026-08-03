import { useNavigate } from "react-router";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import PageHeader from "@/shared/ui/PageHeader";

interface EventDetailHeaderProps {
  eventId: string;
}

export default function EventDetailHeader({ eventId }: EventDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <PageHeader className="px-3 sm:px-6">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-monitor-text-dim hover:text-monitor-text flex items-center gap-2 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="hidden text-14 font-medium sm:inline">뒤로가기</span>
      </button>

      {/* 중앙: 페이지 타이틀 + 이벤트 ID */}
      <div className="ml-auto flex flex-col items-center gap-[2px] sm:absolute sm:left-1/2 sm:ml-0 sm:-translate-x-1/2">
        <span className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
          이상 행동 상세 검토
        </span>
        <span className="text-monitor-text text-12 font-bold sm:text-14">
          {eventId}
        </span>
      </div>
    </PageHeader>
  );
}
