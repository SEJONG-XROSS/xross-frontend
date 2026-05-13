export default function CameraFeedLoading() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#020618]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-9 w-9 rounded-full border-2 border-monitor-border border-t-monitor-accent-blue animate-spin"
        aria-hidden
      />
      <span className="text-[11px] leading-4 text-monitor-text-dim">
        스트림 연결 중…
      </span>
    </div>
  );
}
