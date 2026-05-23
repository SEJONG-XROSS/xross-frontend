import { useState } from "react";
import WebRTCVideoPlayer from "@/shared/components/WebRTCVideoPlayer";

interface EventCCTVPlayerProps {
  cameraId: string;
  cameraName: string;
  alertId?: number;
}

function PlaybackPlayer({ alertId, cameraName }: { alertId: number; cameraName: string }) {
  const [noVideo, setNoVideo] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
  const videoUrl = `${apiBase}/videos/stream/${alertId}`;

  if (noVideo) {
    return (
      <div className="border-monitor-border relative flex min-h-[250px] flex-1 items-center justify-center overflow-hidden bg-black sm:min-h-[300px] md:border-r">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg className="h-9 w-9 text-monitor-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
          </svg>
          <span className="font-mono text-xs text-monitor-text-dim">영상 없음</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-monitor-border relative flex min-h-[250px] flex-1 overflow-hidden bg-black sm:min-h-[300px] md:border-r">
      {/* 상단 오버레이 */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-4 pt-4 pb-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-monitor-accent-blue" />
          <span className="text-[13px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">{cameraName}</span>
        </div>
        <span className="border-monitor-accent-blue/30 bg-monitor-accent-blue/20 text-monitor-accent-blue rounded-sm border px-2 py-0.75 font-mono text-[10px] leading-3.75 tracking-[1px]">
          복기
        </span>
      </div>

      <video
        src={videoUrl}
        controls
        className="h-full w-full object-contain"
        onError={() => setNoVideo(true)}
      />
    </div>
  );
}

export default function EventCCTVPlayer({
  cameraId,
  cameraName,
  alertId,
}: EventCCTVPlayerProps) {
  if (alertId) {
    return <PlaybackPlayer alertId={alertId} cameraName={cameraName} />;
  }

  return (
    <div className="border-monitor-border relative flex min-h-[250px] flex-1 overflow-hidden bg-black sm:min-h-[300px] md:border-r">
      <WebRTCVideoPlayer streamPath={cameraId} className="absolute inset-0" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-4 pt-4 pb-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#fb2c36]/76" />
          <span className="text-[13px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">{cameraName}</span>
        </div>
        <span className="border-event-critical/30 bg-event-critical/20 text-event-critical rounded-[4px] border px-2 py-[3px] font-mono text-[10px] leading-[15px] tracking-[1px]">
          LIVE
        </span>
      </div>
    </div>
  );
}
