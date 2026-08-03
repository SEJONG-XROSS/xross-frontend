import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ShieldIcon from "@/assets/icons/shield.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { getTodayStr, isToday, shiftDay, formatDateLabel } from "@/shared/lib/date";
import { CalendarGrid } from "@/shared/ui/CalendarGrid";
import PageHeader from "@/shared/ui/PageHeader";
import { useMe } from "@/features/auth/hooks/useMe";

/* ── 캘린더 드롭다운 ───────────────────────────── */
interface CalendarProps {
  selected: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

function Calendar({ selected, onSelect, onClose }: CalendarProps) {
  const today = getTodayStr();
  const [viewYear, setViewYear] = useState(() => Number(selected.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(() => Number(selected.slice(5, 7)) - 1);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    const [ty, tm] = today.split("-").map(Number);
    if (viewYear === ty && viewMonth === tm - 1) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const [ty, tm] = today.split("-").map(Number);
  const isNextDisabled = viewYear === ty && viewMonth === tm - 1;

  return (
    <div className="w-[272px] rounded-card border border-monitor-border bg-monitor-card-bg p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* 월 내비게이션 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-md text-monitor-text-dim transition-colors hover:bg-white/10 hover:text-monitor-text"
        >
          <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
        </button>
        <span className="text-13 font-semibold text-monitor-text">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={isNextDisabled}
          className="flex h-7 w-7 items-center justify-center rounded-md text-monitor-text-dim transition-colors hover:bg-white/10 hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <CalendarGrid
        year={viewYear}
        month={viewMonth}
        colorWeekends
        renderDay={(dateStr, weekdayIdx) => {
          const isSelected = dateStr === selected;
          const isTodayDate = dateStr === today;
          const future = dateStr > today;
          const isSun = weekdayIdx === 0;
          const isSat = weekdayIdx === 6;

          return (
            <button
              type="button"
              disabled={future}
              onClick={() => { onSelect(dateStr); onClose(); }}
              className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-control text-12 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
                isSelected
                  ? "bg-monitor-accent-blue text-white"
                  : isTodayDate
                    ? "bg-monitor-accent-blue/15 text-monitor-accent-blue"
                    : future
                      ? "text-monitor-text-dim"
                      : isSun
                        ? "text-event-critical/80 hover:bg-white/5"
                        : isSat
                          ? "text-monitor-accent-blue/80 hover:bg-white/5"
                          : "text-monitor-text hover:bg-white/5"
              }`}
            >
              {dateStr.slice(8)}
              {isTodayDate && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-monitor-accent-blue" />
              )}
            </button>
          );
        }}
      />

      {/* 오늘로 이동 */}
      {selected !== today && (
        <button
          type="button"
          onClick={() => { onSelect(today); onClose(); }}
          className="mt-3 w-full rounded-control border border-monitor-accent-blue/30 py-1.5 text-12 font-medium text-monitor-accent-blue transition-colors hover:bg-monitor-accent-blue/10"
        >
          오늘로 이동
        </button>
      )}
    </div>
  );
}

/* ── MonitoringHeader ──────────────────────────── */
interface MonitoringHeaderProps {
  date: string;
  onDateChange: (date: string) => void;
}

export default function MonitoringHeader({ date, onDateChange }: MonitoringHeaderProps) {
  const { data: me } = useMe();
  const [calOpen, setCalOpen] = useState(false);
  const [calPos, setCalPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const today = isToday(date);

  function openCalendar() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCalPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
    setCalOpen((v) => !v);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        calRef.current &&
        !calRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setCalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <PageHeader>
        {/* 좌측: 타이틀 */}
        <div className="flex items-center gap-2 pl-4 sm:pl-6">
          <ShieldIcon className="text-monitor-accent-blue h-5 w-5 shrink-0" />
          <span className="text-monitor-text text-14 font-bold whitespace-nowrap">
            XROSS 통합 관제
          </span>
        </div>

        {/* 중앙: 날짜 선택 */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDateChange(shiftDay(date, -1))}
            className="text-monitor-text-dim hover:text-monitor-text flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/5"
          >
            <ChevronRightIcon className="h-[13px] w-[13px] rotate-180" />
          </button>

          <button
            ref={triggerRef}
            type="button"
            onClick={openCalendar}
            className={`flex flex-col items-center rounded-control px-3 py-1 transition-colors ${
              calOpen
                ? "text-monitor-text bg-white/10"
                : "text-monitor-text-muted hover:text-monitor-text hover:bg-white/5"
            }`}
          >
            {today && (
              <span className="rounded-full bg-monitor-accent-blue/20 px-1.5 py-0.5 text-10 font-bold text-monitor-accent-blue">
                오늘
              </span>
            )}
            <span className="flex items-center gap-1.5 text-13 font-semibold tabular-nums">
              <CalendarIcon className="text-monitor-text-dim h-3.5 w-3.5 shrink-0" />
              {formatDateLabel(date)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onDateChange(shiftDay(date, 1))}
            disabled={today}
            className="text-monitor-text-dim hover:text-monitor-text flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRightIcon className="h-[13px] w-[13px]" />
          </button>
        </div>

        {/* 우측: 매장 정보 */}
        <div className="ml-auto flex flex-col items-end pr-4 lg:pr-6">
          {me?.name && (
            <span className="text-monitor-text text-12 font-medium whitespace-nowrap">
              {me.name}
            </span>
          )}
          <span className="text-monitor-text-dim text-11 whitespace-nowrap">
            {me?.storeName ?? "—"}
          </span>
        </div>
      </PageHeader>

      {/* 캘린더: body에 portal로 렌더링 */}
      {calOpen &&
        createPortal(
          <div
            ref={calRef}
            style={{ position: "fixed", top: calPos.top, left: calPos.left, zIndex: 9999, transform: "translateX(-50%)" }}
          >
            <Calendar
              selected={date}
              onSelect={onDateChange}
              onClose={() => setCalOpen(false)}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
