import PageHeader from "@/shared/ui/PageHeader";

interface PosHeaderProps {
  version?: string;
}

export default function PosHeader({
  version = "KIS 무인 결제 v3.2",
}: PosHeaderProps) {
  return (
    <PageHeader className="px-3 sm:px-6">
      {/* 중앙: 타이틀 */}
      <div className="mx-auto flex flex-col items-center gap-[2px] sm:absolute sm:left-1/2 sm:mx-0 sm:-translate-x-1/2">
        <span className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
          POS 결제 내역
        </span>
        <span className="text-monitor-text text-12 font-bold sm:text-14">
          {version}
        </span>
      </div>
    </PageHeader>
  );
}
