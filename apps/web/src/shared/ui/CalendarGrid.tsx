export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface CalendarGridProps {
  year: number;
  month: number;
  /** 날짜 문자열(YYYY-MM-DD)과 요일 인덱스(0=일, 6=토)를 받아 셀을 렌더링 */
  renderDay: (dateStr: string, weekdayIndex: number) => React.ReactNode;
  colorWeekends?: boolean;
}

export function CalendarGrid({
  year,
  month,
  renderDay,
  colorWeekends = false,
}: CalendarGridProps) {
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  return (
    <div className="grid grid-cols-7 gap-y-[2px] text-center">
      {WEEKDAYS.map((w, i) => (
        <div
          key={w}
          className={`pb-1 text-[10px] font-medium ${
            colorWeekends && i === 0
              ? "text-event-critical/70"
              : colorWeekends && i === 6
                ? "text-monitor-accent-blue/70"
                : "text-monitor-text-dim"
          }`}
        >
          {w}
        </div>
      ))}
      {Array.from({ length: offset }, (_, i) => (
        <div key={`e-${i}`} />
      ))}
      {Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const dateStr = toDateStr(year, month, day);
        const weekdayIdx = (offset + i) % 7;
        return <div key={dateStr}>{renderDay(dateStr, weekdayIdx)}</div>;
      })}
    </div>
  );
}

export { toDateStr };
