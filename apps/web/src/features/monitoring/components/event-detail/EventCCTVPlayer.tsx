import { useRef, useState } from "react";
import SkipBackIcon from "@/assets/icons/skip-back.svg?react";
import PauseIcon from "@/assets/icons/pause.svg?react";
import SkipForwardIcon from "@/assets/icons/skip-forward.svg?react";
import WebRTCVideoPlayer from "@/shared/components/WebRTCVideoPlayer";

interface EventCCTVPlayerProps {
  cameraId: string;
  cameraName: string;
  timestamp: string;
  alertId?: number;
}

function PlaybackPlayer({ alertId, cameraName }: { alertId: number; cameraName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [noVideo, setNoVideo] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
  const videoUrl = `${apiBase}/videos/stream/${alertId}`;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const skip = (sec: number) => {
    if (videoRef.current) videoRef.current.currentTime += sec;
  };

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
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => setNoVideo(true)}
      />

      {/* 상단 오버레이 */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-4 pt-4 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-monitor-accent-blue" />
          <span className="text-[13px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">{cameraName}</span>
        </div>
        <span className="border-monitor-accent-blue/30 bg-monitor-accent-blue/20 text-monitor-accent-blue rounded-sm border px-2 py-0.75 font-mono text-[10px] leading-3.75 tracking-[1px]">
          복기
        </span>
      </div>

      {/* 하단 컨트롤 */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent pt-12 pb-5">
        <div className="mx-5 mb-3">
          <div
            className="relative h-0.75 w-full cursor-pointer overflow-visible rounded-full bg-white/20"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              if (videoRef.current) videoRef.current.currentTime = pct * videoRef.current.duration;
            }}
          >
            <div className="bg-monitor-accent-blue absolute top-0 left-0 h-full rounded-full" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]" style={{ left: `${progress}%` }} />
          </div>
        </div>
        <div className="mx-5 flex items-center gap-4">
          <button onClick={() => skip(-10)} className="text-monitor-text-muted hover:text-monitor-text transition-colors" aria-label="10초 뒤로">
            <SkipBackIcon className="h-5 w-5" />
          </button>
          <button onClick={toggle} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-10 sm:w-10" aria-label="재생/일시정지">
            {playing
              ? <PauseIcon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              : <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <button onClick={() => skip(10)} className="text-monitor-text-muted hover:text-monitor-text transition-colors" aria-label="10초 앞으로">
            <SkipForwardIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventCCTVPlayer({
  cameraId,
  cameraName,
  timestamp,
  alertId,
}: EventCCTVPlayerProps) {
  if (alertId) {
    return <PlaybackPlayer alertId={alertId} cameraName={cameraName} />;
  }

  return (
    <div className="border-monitor-border relative flex min-h-[250px] flex-1 overflow-hidden bg-black sm:min-h-[300px] md:border-r">
      <WebRTCVideoPlayer streamPath={cameraId} className="absolute inset-0" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-linear-to-b from-black/80 to-transparent px-4 pt-4 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#fb2c36]/76" />
          <span className="text-[13px] leading-4 font-bold tracking-[0.3px] text-white drop-shadow-sm">{cameraName}</span>
        </div>
        <span className="border-event-critical/30 bg-event-critical/20 text-event-critical rounded-[4px] border px-2 py-[3px] font-mono text-[10px] leading-[15px] tracking-[1px]">
          LIVE
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent pt-12 pb-5">
        <div className="mx-5 flex items-center gap-4">
          <button className="text-monitor-text-muted hover:text-monitor-text transition-colors" aria-label="이전 프레임">
            <SkipBackIcon className="h-5 w-5" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-10 sm:w-10" aria-label="일시정지">
            <PauseIcon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </button>
          <button className="text-monitor-text-muted hover:text-monitor-text transition-colors" aria-label="다음 프레임">
            <SkipForwardIcon className="h-5 w-5" />
          </button>
          <span className="text-monitor-text font-mono text-[11px] leading-4 sm:text-[12px]">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
