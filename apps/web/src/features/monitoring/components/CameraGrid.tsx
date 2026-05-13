import { useState } from "react";
import CameraFeedCard from "@/features/monitoring/components/CameraFeedCard";
import type { CameraFeed } from "@/features/monitoring/types/monitoring.types";

const DESKTOP_PAGE_SIZE = 4;

interface CameraGridProps {
  cameras: CameraFeed[];
  isDesktop?: boolean;
}

export default function CameraGrid({ cameras, isDesktop = true }: CameraGridProps) {
  console.log("[CameraGrid] Rendering - isDesktop:", isDesktop, "cameras:", cameras.length);

  return isDesktop ? (
    <DesktopGrid cameras={cameras} />
  ) : (
    <MobileCarousel cameras={cameras} />
  );
}

function MobileCarousel({ cameras }: { cameras: CameraFeed[] }) {
  const [idx, setIdx] = useState(0);
  const count = cameras.length;

  if (count === 0) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 p-2">
        <CameraFeedCard camera={cameras[idx]} className="h-full" />
      </div>

      {count > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 pb-2 pt-1">
          <button
            onClick={() => setIdx((i) => i - 1)}
            disabled={idx === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-monitor-border text-[16px] text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="이전 카메라"
          >
            ‹
          </button>

          <div className="flex items-center gap-1.5">
            {cameras.map((cam, i) => (
              <button
                key={cam.id}
                onClick={() => setIdx(i)}
                className={
                  i === idx
                    ? "h-2 w-5 rounded-full bg-monitor-accent-blue transition-all"
                    : "h-2 w-2 rounded-full bg-monitor-border-strong transition-all hover:bg-monitor-text-muted"
                }
                aria-label={`${cam.name}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIdx((i) => i + 1)}
            disabled={idx === count - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-monitor-border text-[16px] text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="다음 카메라"
          >
            ›
          </button>

          <span className="ml-1 font-mono text-[11px] text-monitor-text-dim">
            {idx + 1}/{count}
          </span>
        </div>
      )}
    </div>
  );
}

function DesktopGrid({ cameras }: { cameras: CameraFeed[] }) {
  const count = cameras.length;

  if (count === 1) {
    return (
      <div className="h-full p-4">
        <CameraFeedCard camera={cameras[0]} className="h-full" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        {cameras.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} className="h-full" />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        <CameraFeedCard camera={cameras[0]} className="h-full" />
        <div className="grid grid-rows-2 gap-4">
          <CameraFeedCard camera={cameras[1]} />
          <CameraFeedCard camera={cameras[2]} />
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-4 p-4">
        {cameras.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} />
        ))}
      </div>
    );
  }

  return <DesktopPaginatedGrid cameras={cameras} />;
}

function DesktopPaginatedGrid({ cameras }: { cameras: CameraFeed[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(cameras.length / DESKTOP_PAGE_SIZE);
  const paged = cameras.slice(
    page * DESKTOP_PAGE_SIZE,
    (page + 1) * DESKTOP_PAGE_SIZE,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-4 p-4">
        {paged.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} />
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-center gap-3 pb-3">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-monitor-border text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="이전 페이지"
        >
          ‹
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={
                i === page
                  ? "h-1.5 w-4 rounded-full bg-monitor-accent-blue transition-all"
                  : "h-1.5 w-1.5 rounded-full bg-monitor-border-strong transition-all hover:bg-monitor-text-muted"
              }
              aria-label={`${i + 1}페이지`}
            />
          ))}
        </div>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages - 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-monitor-border text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="다음 페이지"
        >
          ›
        </button>
      </div>
    </div>
  );
}
