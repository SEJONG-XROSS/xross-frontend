interface PosHeaderProps {
  version?: string;
}

export default function PosHeader({
  version = "KIS 무인 결제 v3.2",
}: PosHeaderProps) {
  return (
    <header className="bg-surface-page relative flex h-[56px] shrink-0 items-center border-b border-[#cad5e2] px-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] sm:px-6">
      {/* 중앙: 타이틀 */}
      <div className="mx-auto flex flex-col items-center gap-[2px] sm:absolute sm:left-1/2 sm:mx-0 sm:-translate-x-1/2">
        <span className="text-monitor-text-muted font-mono text-[10px] tracking-[1px] uppercase">
          POS 결제 내역
        </span>
        <span className="text-dashboard-title text-[12px] font-bold tracking-[-0.15px] sm:text-[14px]">
          {version}
        </span>
      </div>

      {/* 하단 blue gradient 라인 */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-[rgba(43,127,255,0.5)] via-[rgba(81,162,255,0.5)] to-transparent" />
    </header>
  );
}
