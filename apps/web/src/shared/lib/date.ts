export function getTodayStr(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayStr();
}

export function dayBounds(dateStr: string): { startDate: string; endDate: string } {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(`${dateStr}T23:59:59.999`);
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

export function shiftDay(dateStr: string, delta: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toLocaleDateString("en-CA");
}

export function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${y}.${m}.${d}`;
}
