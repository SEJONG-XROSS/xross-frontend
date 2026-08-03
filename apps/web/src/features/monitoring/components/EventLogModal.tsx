import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@xross/core";
import type { EventResponse } from "@/features/monitoring/api/monitoring.types";
import LogsIcon from "@/assets/icons/logs.svg?react";

interface EventLogModalProps {
  open: boolean;
  events: EventResponse[];
  date: string;
  onClose: () => void;
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  ENTER: "입장",
  LOCATION_UPDATE: "위치 업데이트",
  SENSOR_TRIGGER: "센서 감지",
  PICK: "상품 집기",
  PUT: "상품 반납",
  BROWSE_ONLY: "진열대 탐색",
  CART_UPDATED: "장바구니 변경",
  PAYMENT_RECEIVED: "결제 완료",
  PAYMENT_MATCHED: "결제 일치",
  PAYMENT_MISMATCH: "장바구니 불일치",
  UNPAID_SUSPICIOUS: "미결제 의심",
  EXIT_LINE_CROSSED: "퇴장 감지",
  LONG_STAY: "장시간 체류",
  FALL_DETECTED: "낙상 감지",
  ALERT_SENT: "알림 발송",
};

const SOURCE_LABEL: Record<string, string> = {
  CEILING_CAMERA: "천장 카메라",
  FREEZER_CAMERA: "냉동고 카메라",
  WEIGHT_SENSOR: "무게 센서",
  POS: "POS",
  BACKEND: "백엔드",
  SYSTEM: "시스템",
};

type FilterKey = "all" | "entry" | "product" | "payment" | "anomaly";

const FILTERS: { key: FilterKey; label: string; types: string[] }[] = [
  { key: "all",     label: "전체",      types: [] },
  { key: "entry",   label: "입장·이동", types: ["ENTER", "LOCATION_UPDATE", "EXIT_LINE_CROSSED"] },
  { key: "product", label: "상품",      types: ["PICK", "PUT", "BROWSE_ONLY", "CART_UPDATED", "SENSOR_TRIGGER"] },
  { key: "payment", label: "결제",      types: ["PAID", "PAYMENT_MATCHED"] },
  { key: "anomaly", label: "이상 감지", types: ["UNPAID_SUSPICIOUS", "LONG_STAY", "FALL_DETECTED", "PAYMENT_MISMATCH"] },
];

type Severity = "critical" | "warning" | "success" | "info";

const TYPE_SEVERITY: Record<string, Severity> = {
  UNPAID_SUSPICIOUS: "critical",
  FALL_DETECTED: "critical",
  PAYMENT_MISMATCH: "warning",
  LONG_STAY: "warning",
  ALERT_SENT: "warning",
  PAYMENT_MATCHED: "success",
};

const TYPE_BADGE: Record<Severity, string> = {
  critical: "bg-event-critical/10 text-event-critical border border-event-critical/25",
  warning:  "bg-event-warning/10 text-event-warning border border-event-warning/25",
  success:  "bg-monitor-accent-green/10 text-monitor-accent-green border border-monitor-accent-green/25",
  info:     "bg-monitor-card-bg text-monitor-text border border-monitor-border",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(dateStr: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return "금일";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const TABLE_COLS = "grid-cols-[60px_72px_1fr_130px_88px]";

const COL_HEADERS = ["ID", "시각", "이벤트 유형", "소스", "추적 키"];

export default function EventLogModal({ open, events, date, onClose }: EventLogModalProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = { all: events.length, entry: 0, product: 0, payment: 0, anomaly: 0 };
    for (const e of events) {
      for (const f of FILTERS.slice(1)) {
        if (f.types.includes(e.type)) counts[f.key]++;
      }
    }
    return counts;
  }, [events]);

  const filtered = useMemo(() => {
    const filterTypes = FILTERS.find((f) => f.key === filter)?.types ?? [];
    return [...events]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .filter((e) => filterTypes.length === 0 || filterTypes.includes(e.type))
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          EVENT_TYPE_LABEL[e.type]?.includes(q) ||
          SOURCE_LABEL[e.source]?.includes(q) ||
          String(e.customer?.trackingKey ?? "").includes(q)
        );
      });
  }, [events, filter, search]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px]" onClick={onClose} />

      {/* 모달 */}
      <div
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-monitor-border bg-monitor-bg shadow-[0_32px_96px_rgba(0,0,0,0.7)]"
        style={{ height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 헤더 ── */}
        <div className="shrink-0 border-b border-monitor-border bg-monitor-card-bg px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-monitor-accent-blue/10 border-monitor-accent-blue/20 flex h-8 w-8 items-center justify-center rounded-control border">
                <LogsIcon className="h-4 w-4 text-monitor-accent-blue" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-14 font-bold text-monitor-text">
                    이벤트 로그
                  </span>
                  <span className="rounded-badge bg-monitor-bg border border-monitor-border px-2 py-0.5 font-mono text-11 text-monitor-text-dim">
                    {formatDate(date)}
                  </span>
                </div>
                <span className="font-mono text-11 text-monitor-text-dim">
                  총 {events.length}건
                  {filtered.length !== events.length && (
                    <span className="text-monitor-accent-blue"> · 필터 {filtered.length}건</span>
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-control text-monitor-text-dim transition-colors hover:bg-white/5 hover:text-monitor-text"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── 필터 + 검색 ── */}
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-monitor-border px-5 py-2.5">
          {/* 필터 탭 */}
          <div className="flex gap-1">
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              const count = filterCounts[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-control px-3 py-1.5 text-11 font-semibold transition-all",
                    active
                      ? "bg-monitor-accent-blue text-white"
                      : "text-monitor-text-dim hover:bg-white/5 hover:text-monitor-text-muted",
                  )}
                >
                  {label}
                  <span className={cn(
                    "rounded-full px-1.5 py-px font-mono text-10 font-bold leading-none",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-monitor-border text-monitor-text-dim",
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 검색 */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-monitor-text-dim pointer-events-none" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="유형·소스·고객ID 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-52 rounded-control border border-monitor-border bg-monitor-card-bg pl-8 pr-3 font-mono text-11 text-monitor-text placeholder:text-monitor-text-dim focus:border-monitor-accent-blue/60 focus:outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-monitor-text-dim hover:text-monitor-text"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── 테이블 헤더 ── */}
        <div className={cn("grid shrink-0 gap-x-3 border-b border-monitor-border bg-white/5 px-5 py-2", TABLE_COLS)}>
          {COL_HEADERS.map((h, i) => (
            <span key={i} className="font-mono text-10 font-bold uppercase tracking-caps text-monitor-text-dim">
              {h}
            </span>
          ))}
        </div>

        {/* ── 목록 ── */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-monitor-text-dim">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity={0.4}>
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M27 27L33 33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-13">해당하는 이벤트가 없습니다.</span>
            </div>
          ) : (
            filtered.map((event, idx) => {
              const severity: Severity = TYPE_SEVERITY[event.type] ?? "info";
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={event.id}
                  className={cn(
                    "hover:bg-monitor-accent-blue/[0.04] grid items-center gap-x-3 px-5 py-2.5 transition-colors",
                    TABLE_COLS,
                    isEven ? "bg-transparent" : "bg-white/[0.015]",
                  )}
                >
                  {/* 이벤트 ID */}
                  <span className="font-mono text-11 text-monitor-text-dim">
                    #{event.id}
                  </span>

                  {/* 시각 */}
                  <span className="font-mono text-11 tabular-nums text-monitor-text-dim">
                    {formatTime(event.occurredAt)}
                  </span>

                  {/* 이벤트 유형 배지 */}
                  <div className="flex items-center">
                    <span className={cn(
                      "inline-flex items-center rounded-badge px-2 py-0.5 text-11 font-semibold leading-none",
                      TYPE_BADGE[severity],
                    )}>
                      {EVENT_TYPE_LABEL[event.type] ?? event.type}
                    </span>
                  </div>

                  {/* 소스 */}
                  <span className="truncate text-11 text-monitor-text-muted">
                    {SOURCE_LABEL[event.source] ?? event.source}
                  </span>

                  {/* 추적 키 */}
                  <span className="font-mono text-11 text-monitor-text-dim">
                    {event.customer?.trackingKey != null ? (
                      <span className="rounded bg-monitor-card-bg border border-monitor-border px-1.5 py-0.5">
                        #{event.customer.trackingKey}
                      </span>
                    ) : "—"}
                  </span>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
