import { cn } from "@xross/core";
import type { CameraFeed } from "@/features/monitoring/types/monitoring.types";
import WebRTCVideoPlayer from "@/shared/components/WebRTCVideoPlayer";

interface CameraFeedCardProps {
  camera: CameraFeed;
  className?: string;
  fullHeight?: boolean;
}

export default function CameraFeedCard({
  camera,
  className,
  fullHeight = false,
}: CameraFeedCardProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-card border bg-black",
        camera.isOnline
          ? "border-event-critical/50 shadow-glow-critical"
          : "border-monitor-border",
        className,
      )}
    >
      {/* CCTV 영상 영역: 온라인 시 로딩 UI, 오프라인 시 빈 캔버스 */}
      <div className={cn("flex min-h-0 w-full items-center justify-center", fullHeight ? "flex-1" : "")}>
        <div className={cn("bg-monitor-card-bg relative w-full overflow-hidden", fullHeight ? "h-full" : "aspect-video")}>
          {camera.isOnline ? (
            <WebRTCVideoPlayer streamPath={camera.id} className="h-full w-full" />
          ) : (
            <div className="from-monitor-bg to-monitor-card-bg absolute inset-0 bg-linear-to-br" />
          )}
        </div>
      </div>

      {/* 상단 오버레이 */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-3 pt-3 pb-6">
        {/* 카메라 정보 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                camera.isOnline ? "bg-event-critical" : "bg-monitor-text-dim",
              )}
            />
            <span className="text-12 font-bold text-white drop-shadow-sm">
              {camera.name}
            </span>
          </div>
          <span className="text-monitor-accent-blue pl-4 font-mono text-10">
            {camera.id}
          </span>
        </div>

        {/* 상태 배지 */}
        <div className="flex items-center gap-2">
          {camera.isOnline && (
            <span className="border-monitor-border-strong rounded-badge border bg-black/70 px-2 py-[3px] font-mono text-10 text-white">
              ON
            </span>
          )}
          {camera.isRecording && (
            <span className="text-event-critical border-event-critical/30 bg-event-critical/20 rounded-badge border px-2 py-[3px] font-mono text-10 tracking-caps">
              REC
            </span>
          )}
        </div>
      </div>

      {/* 오프라인 상태 표시 */}
      {!camera.isOnline && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-monitor-text-dim font-mono text-12">
            OFFLINE
          </span>
        </div>
      )}
    </div>
  );
}
