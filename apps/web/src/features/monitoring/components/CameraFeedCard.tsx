import { cn } from "@/shared/lib/utils";
import type { CameraFeed } from "@/features/monitoring/types/monitoring.types";
import WebRTCVideoPlayer from "@/shared/components/WebRTCVideoPlayer";

interface CameraFeedCardProps {
  camera: CameraFeed;
  className?: string;
}

export default function CameraFeedCard({
  camera,
  className,
}: CameraFeedCardProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-[14px] border bg-black",
        camera.isOnline
          ? "border-[rgba(251,44,54,0.5)] shadow-[0_0_13px_rgba(239,68,68,0.2)]"
          : "border-monitor-border",
        className,
      )}
    >
      {/* CCTV 영상 영역: 온라인 시 로딩 UI, 오프라인 시 빈 캔버스 */}
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="relative aspect-video w-full overflow-hidden bg-[#020618]">
          {camera.isOnline ? (
            <WebRTCVideoPlayer streamPath={camera.id} className="h-full w-full" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172b] to-[#020618]" />
          )}
        </div>
      </div>

      {/* 상단 오버레이 */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/80 to-transparent px-3 pt-3 pb-6">
        {/* 카메라 정보 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                camera.isOnline ? "bg-[#fb2c36]/76" : "bg-gray-500",
              )}
            />
            <span className="text-[12px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">
              {camera.name}
            </span>
          </div>
          <span className="text-monitor-accent-blue pl-4 font-mono text-[10px] leading-[15px] tracking-[0.5px]">
            {camera.id}
          </span>
        </div>

        {/* 상태 배지 */}
        <div className="flex items-center gap-2">
          {camera.isOnline && (
            <span className="border-monitor-border-strong rounded-[4px] border bg-black/70 px-2 py-[3px] font-mono text-[10px] leading-[15px] text-white">
              ON
            </span>
          )}
          {camera.isRecording && (
            <span className="text-event-critical rounded-[4px] border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.2)] px-2 py-[3px] font-mono text-[10px] leading-[15px] tracking-[1px]">
              REC
            </span>
          )}
        </div>
      </div>

      {/* 오프라인 상태 표시 */}
      {!camera.isOnline && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-monitor-text-dim font-mono text-[12px]">
            OFFLINE
          </span>
        </div>
      )}
    </div>
  );
}
