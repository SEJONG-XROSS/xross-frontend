import { cn } from "@xross/core";

interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * 페이지 상단 공통 헤더 셸 — 다크 캔버스 + 하단 blue gradient 헤어라인.
 * 내부 레이아웃(좌/중앙/우 배치)은 각 페이지 헤더가 children으로 구성한다.
 */
export default function PageHeader({ className, children }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-monitor-card-bg border-monitor-border relative flex h-14 shrink-0 items-center border-b",
        className,
      )}
    >
      {children}
      <div className="from-brand-primary/50 via-monitor-accent-blue/50 absolute inset-x-0 bottom-0 h-px bg-linear-to-r to-transparent" />
    </header>
  );
}
