import { useCallback, useState } from "react";
import { useOutlet, useSearchParams } from "react-router";
import MonitoringPage from "@/features/monitoring/pages/MonitoringPage";
import { useAlertStream } from "@/features/monitoring/hooks/useAlertStream";
import { useEventStream } from "@/features/monitoring/hooks/useEventStream";
import { getTodayStr } from "@/shared/lib/date";
import type {
  AlertResponse,
  EventResponse,
} from "@/features/monitoring/api/monitoring.types";

function isValidDateStr(s: string | null): s is string {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return !isNaN(new Date(`${s}T00:00:00`).getTime());
}

export interface MonitoringContext {
  alerts: AlertResponse[];
  events: EventResponse[];
  connected: boolean;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
}

/**
 * /monitoring/* 라우트 트리의 layout.
 *
 * 자식 라우트(알림/이벤트 상세) 진입 시에도 SSE 와 카메라(WebRTC) 가
 * 끊기지 않도록, MonitoringPage 를 항상 mount 상태로 유지하고
 * 자식 라우트는 그 위에 absolute overlay 로 덮어 표시한다.
 *
 * selectedDate 는 mount 시점에 URL ?date= 에서 1회 읽고 자체 state 로 보유.
 * 자식 라우트에서 search 가 비어도 layout state 는 그대로라 SSE 재연결 없음.
 */
export default function MonitoringLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedDate, setSelectedDateState] = useState(() => {
    const d = searchParams.get("date");
    return isValidDateStr(d) ? d : getTodayStr();
  });

  const setSelectedDate = useCallback(
    (d: string) => {
      setSelectedDateState(d);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("date", d);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { events } = useEventStream(selectedDate);
  const { alerts, connected } = useAlertStream(selectedDate);

  const context: MonitoringContext = {
    alerts,
    events,
    connected,
    selectedDate,
    setSelectedDate,
  };

  const outlet = useOutlet(context);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <MonitoringPage {...context} />
      {outlet && (
        <div className="bg-monitor-bg absolute inset-0 z-10 flex flex-col overflow-hidden">
          {outlet}
        </div>
      )}
    </div>
  );
}
