import { useState, useCallback, useRef, useEffect } from "react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { useClickOutside } from "@/hooks/useClickOutside";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { CalendarGrid } from "@/shared/ui/CalendarGrid";
import type { DateRange } from "@/features/pos/types/pos.types";

/* ── helpers ──────────────────────────────────── */
function toKR(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

function formatLabel(range: DateRange): string {
  if (!range.from && !range.to) return "전체 기간";
  if (range.from && !range.to) return range.from;
  if (range.from && range.to) {
    if (range.from === range.to) return range.from;
    return `${range.from} ~ ${range.to}`;
  }
  return "전체 기간";
}

const PRESETS: { label: string; get: () => DateRange }[] = [
  { label: "전체 기간", get: () => ({ from: null, to: null }) },
  {
    label: "오늘",
    get: () => {
      const d = toKR(new Date());
      return { from: d, to: d };
    },
  },
  {
    label: "어제",
    get: () => {
      const d = toKR(new Date(Date.now() - 86400000));
      return { from: d, to: d };
    },
  },
  {
    label: "최근 7일",
    get: () => ({
      from: toKR(new Date(Date.now() - 6 * 86400000)),
      to: toKR(new Date()),
    }),
  },
  {
    label: "최근 30일",
    get: () => ({
      from: toKR(new Date(Date.now() - 29 * 86400000)),
      to: toKR(new Date()),
    }),
  },
];

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

/* ── CalendarMonth ────────────────────────────── */
interface CalendarMonthProps {
  year: number;
  month: number;
  range: DateRange;
  hoverDate: string | null;
  onSelect: (date: string) => void;
  onHover: (date: string | null) => void;
}

function CalendarMonth({ year, month, range, hoverDate, onSelect, onHover }: CalendarMonthProps) {
  const today = toKR(new Date());

  function isInRange(dateStr: string): boolean {
    if (!range.from) return false;
    const end = range.to ?? hoverDate;
    if (!end) return dateStr === range.from;
    const [lo, hi] = range.from <= end ? [range.from, end] : [end, range.from];
    return dateStr >= lo && dateStr <= hi;
  }

  return (
    <div className="w-full sm:w-[224px]">
      <div className="text-monitor-text mb-2 text-center text-[13px] font-semibold">
        {year}년 {MONTH_NAMES[month]}
      </div>
      <CalendarGrid
        year={year}
        month={month}
        renderDay={(dateStr) => {
          const end = dateStr === range.from || dateStr === range.to;
          const inRange = isInRange(dateStr);
          const isToday = dateStr === today;
          return (
            <button
              type="button"
              onClick={() => onSelect(dateStr)}
              onMouseEnter={() => onHover(dateStr)}
              onMouseLeave={() => onHover(null)}
              className={`mx-auto flex h-[28px] w-[28px] items-center justify-center rounded-md text-[12px] transition-colors ${
                end
                  ? "bg-monitor-accent-blue font-semibold text-white"
                  : inRange
                    ? "text-monitor-accent-blue bg-[rgba(81,162,255,0.15)]"
                    : isToday
                      ? "text-monitor-accent-blue font-semibold"
                      : "text-monitor-text hover:bg-[rgba(255,255,255,0.06)]"
              }`}
            >
              {dateStr.slice(8)}
            </button>
          );
        }}
      />
    </div>
  );
}

/* ── DateRangePicker ─────────────────────────── */
interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function DateRangePicker({
  value,
  onChange,
  open,
  onToggle,
  onClose,
}: DateRangePickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selecting, setSelecting] = useState<"from" | "to" | null>(null);
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTempRange(value);
      setSelecting(null);
    }
  }, [open, value]);

  useClickOutside(ref, onClose, open);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  const handleSelect = useCallback(
    (dateStr: string) => {
      if (!selecting || selecting === "from") {
        setTempRange({ from: dateStr, to: null });
        setSelecting("to");
      } else {
        const from = tempRange.from!;
        const [lo, hi] = from <= dateStr ? [from, dateStr] : [dateStr, from];
        const final = { from: lo, to: hi };
        setTempRange(final);
        setSelecting(null);
        onChange(final);
        onClose();
      }
    },
    [selecting, tempRange.from, onChange, onClose],
  );

  function handlePreset(preset: DateRange) {
    onChange(preset);
    onClose();
  }

  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const nextMo = viewMonth === 11 ? 0 : viewMonth + 1;

  const hasRange = value.from !== null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`border-monitor-border bg-monitor-card-bg text-monitor-text flex h-10 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium whitespace-nowrap transition-colors hover:bg-[rgba(255,255,255,0.06)] ${
          hasRange ? "border-monitor-accent-blue/40" : ""
        }`}
      >
        <CalendarIcon className="text-monitor-text-dim h-[14px] w-[14px] shrink-0" />
        <span
          className={`max-w-[180px] truncate ${hasRange ? "text-monitor-accent-blue" : ""}`}
        >
          {formatLabel(value)}
        </span>
        <ChevronDownIcon
          className={`text-monitor-text-dim ml-1 h-[14px] w-[14px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-monitor-border bg-monitor-card-bg fixed inset-x-2 top-1/2 z-50 -translate-y-1/2 rounded-xl border p-4 shadow-xl sm:absolute sm:inset-x-auto sm:top-[calc(100%+4px)] sm:right-0 sm:translate-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            {/* 프리셋 */}
            <div className="border-monitor-border flex shrink-0 flex-row gap-1 overflow-x-auto border-b pb-3 sm:w-[110px] sm:flex-col sm:gap-0.5 sm:overflow-x-visible sm:border-r sm:border-b-0 sm:pr-4 sm:pb-0">
              <span className="text-monitor-text-dim mb-1 hidden text-[10px] font-semibold tracking-wider uppercase sm:mb-2 sm:block">
                프리셋
              </span>
              {PRESETS.map((p) => {
                const preset = p.get();
                const active =
                  value.from === preset.from && value.to === preset.to;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={`shrink-0 rounded-md px-2 py-1.5 text-left text-[12px] whitespace-nowrap transition-colors ${
                      active
                        ? "text-monitor-accent-blue bg-[rgba(81,162,255,0.12)] font-medium"
                        : "text-monitor-text-muted hover:text-monitor-text hover:bg-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* 달력 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="text-monitor-text-dim hover:text-monitor-text flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="text-monitor-text-dim hover:text-monitor-text flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                >
                  ›
                </button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <CalendarMonth
                  year={viewYear}
                  month={viewMonth}
                  range={tempRange}
                  hoverDate={selecting === "to" ? hoverDate : null}
                  onSelect={handleSelect}
                  onHover={setHoverDate}
                />
                <CalendarMonth
                  year={nextYear}
                  month={nextMo}
                  range={tempRange}
                  hoverDate={selecting === "to" ? hoverDate : null}
                  onSelect={handleSelect}
                  onHover={setHoverDate}
                />
              </div>
              {selecting === "to" && (
                <p className="text-monitor-accent-blue mt-3 text-center text-[11px]">
                  종료일을 선택하세요
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
