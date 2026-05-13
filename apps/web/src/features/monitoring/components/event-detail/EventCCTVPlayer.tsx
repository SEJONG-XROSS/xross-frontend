import SkipBackIcon from "@/assets/icons/skip-back.svg?react";
import PauseIcon from "@/assets/icons/pause.svg?react";
import SkipForwardIcon from "@/assets/icons/skip-forward.svg?react";
import WebRTCVideoPlayer from "@/shared/components/WebRTCVideoPlayer";

interface EventCCTVPlayerProps {
  cameraId: string;
  cameraName: string;
  timestamp: string;
}

export default function EventCCTVPlayer({
  cameraId,
  cameraName,
  timestamp,
}: EventCCTVPlayerProps) {
  const playbackPercent = 100;
  const isLive = playbackPercent >= 99.5;

  return (
    <div className="border-monitor-border relative flex min-h-[250px] flex-1 overflow-hidden bg-black sm:min-h-[300px] md:border-r">
      <WebRTCVideoPlayer streamPath={cameraId} className="absolute inset-0" />

      {/* 상단 오버레이 — CameraFeedCard 스타일 */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-4 pt-4 pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#fb2c36]/76" />
            <span className="text-[13px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">
              {cameraName}
            </span>
          </div>
        </div>
        <span className="border-event-critical/30 bg-event-critical/20 text-event-critical rounded-[4px] border px-2 py-[3px] font-mono text-[10px] leading-[15px] tracking-[1px]">
          REC
        </span>
      </div>

      {/* 하단 컨트롤 — 피드 위 absolute 오버레이 */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent pt-12 pb-5">
        {/* 시크바 */}
        <div className="mx-5 mb-3">
          <div className="relative h-[3px] w-full overflow-visible rounded-full bg-white/20">
            {/* 재생 진행 */}
            <div
              className="bg-monitor-accent-blue absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${playbackPercent}%` }}
            />
            {/* 핸들 */}
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              style={{ left: `${playbackPercent}%` }}
            />
          </div>
        </div>

        {/* 컨트롤 로우 */}
        <div className="mx-5 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              className="text-monitor-text-muted hover:text-monitor-text transition-colors"
              aria-label="이전 프레임"
            >
              <SkipBackIcon className="h-5 w-5" />
            </button>

            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-10 sm:w-10"
              aria-label="일시정지"
            >
              <PauseIcon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </button>

            <button
              className="text-monitor-text-muted hover:text-monitor-text transition-colors"
              aria-label="다음 프레임"
            >
              <SkipForwardIcon className="h-5 w-5" />
            </button>

            <div className="border-monitor-border-strong hidden h-4 border-l sm:block" />
            <span className="text-monitor-text font-mono text-[11px] leading-4 sm:text-[12px]">
              {timestamp}
            </span>
            <div
              className={`flex items-center gap-1.5 font-mono text-[11px] leading-4 ${
                isLive ? "text-event-critical" : "text-monitor-text-dim"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLive ? "bg-event-critical" : "bg-monitor-text-dim"
                }`}
              />
              <span>라이브</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
