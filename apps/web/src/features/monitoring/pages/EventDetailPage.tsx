import { useParams, Navigate, useNavigate } from "react-router";
import EventDetailHeader from "@/features/monitoring/components/event-detail/EventDetailHeader";
import EventCCTVPlayer from "@/features/monitoring/components/event-detail/EventCCTVPlayer";
import EventDetailPanel from "@/features/monitoring/components/event-detail/EventDetailPanel";
import { useEventDetails } from "@/features/monitoring/hooks/useEventDetails";
import { useEvents } from "@/features/monitoring/hooks/useEvents";
import {
  mapEventToDetectionEvent,
  mapEventDetailsToVerification,
  mapEventDetailsToLogEntries,
} from "@/features/monitoring/lib/mappers";
import type { EventDetail } from "@/features/monitoring/types/monitoring.types";
import type { EventSource } from "@/features/monitoring/api/monitoring.types";

const SOURCE_CAMERA_NAME: Record<EventSource, string> & Record<string, string> = {
  CEILING_CAMERA: "천장 카메라",
  FREEZER_CAMERA: "냉동고 카메라",
  WEIGHT_SENSOR: "무게 센서",
  POS: "POS",
  BACKEND: "백엔드",
  SYSTEM: "시스템",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  if (!eventId) return <Navigate to="/monitoring" replace />;

  const { data: details = [], isLoading } = useEventDetails(eventId);
  const { data: events = [] } = useEvents();

  if (isLoading) {
    return (
      <div className="bg-monitor-card-bg flex h-full items-center justify-center">
        <span className="text-monitor-text-muted text-sm">로딩 중...</span>
      </div>
    );
  }

  if (!details.length) {
    return (
      <div className="bg-monitor-card-bg flex h-full flex-col items-center justify-center gap-4">
        <span className="text-monitor-text-muted text-sm">
          이벤트 상세 데이터가 없습니다.
        </span>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-monitor-accent-blue text-sm hover:underline"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const eventResponse = events.find((e) => e.id === eventId);
  const detectionEvent = eventResponse
    ? mapEventToDetectionEvent(eventResponse)
    : null;

  const cameraSource = details.find(
    (d) => d.source === "CEILING_CAMERA" || d.source === "FREEZER_CAMERA",
  )?.source ?? details[0]?.source ?? "CEILING_CAMERA";

  const confidence =
    eventResponse?.confidence != null
      ? Math.round(eventResponse.confidence * 100)
      : Math.round(
          (details.find((d) => d.confidence != null)?.confidence ?? 0) * 100,
        );

  const eventDetail: EventDetail = {
    id: String(eventId),
    title: detectionEvent?.title ?? "이벤트 상세",
    timestamp: detectionEvent?.timestamp ?? "",
    severity: detectionEvent?.severity ?? "info",
    description: detectionEvent?.description ?? "",
    tags: detectionEvent?.tags,
    cameraId: cameraSource,
    cameraName: SOURCE_CAMERA_NAME[cameraSource as EventSource],
    confidence,
    verification: mapEventDetailsToVerification(details),
    logEntries: mapEventDetailsToLogEntries(details),
    showActions: detectionEvent?.severity === "critical",
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-monitor-card-bg">
      <EventDetailHeader eventId={eventDetail.id} />

      <main className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <EventCCTVPlayer
          cameraId={eventDetail.cameraId}
          cameraName={eventDetail.cameraName}
          timestamp={eventDetail.timestamp}
        />
        <EventDetailPanel event={eventDetail} />
      </main>
    </div>
  );
}
