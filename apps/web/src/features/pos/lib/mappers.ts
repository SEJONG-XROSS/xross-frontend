import type { EventResponse } from "@/features/monitoring/api/monitoring.types";
import type { ApiPaymentMethod } from "@/features/pos/api/pos.types";
import type { PosTransaction, PosSummaryStats, PaymentMethod } from "@/features/pos/types/pos.types";

const API_METHOD_MAP: Record<ApiPaymentMethod, PaymentMethod> = {
  CARD: "card",
  CASH: "cash",
  MOBILE_PAY: "mobile",
  QR_CODE: "qr_code",
};

export function mapApiPaymentMethod(method: ApiPaymentMethod): PaymentMethod {
  return API_METHOD_MAP[method];
}

export const POS_EVENT_TYPES = [
  "PAYMENT_RECEIVED",
  "PAYMENT_MISMATCH",
  "UNPAID_SUSPICIOUS",
] as const;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function mapEventToPosTransaction(e: EventResponse, paymentMethod: PaymentMethod | null = null): PosTransaction {
  const isUnpaid = e.type === "UNPAID_SUSPICIOUS";
  const isMismatch = e.type === "PAYMENT_MISMATCH";

  const status = isUnpaid ? "unpaid" : isMismatch ? "mismatch" : "normal";

  const note = isUnpaid
    ? (e.message ?? "퇴장 시 결제 기록 없음")
    : isMismatch
      ? (e.message ?? "장바구니와 결제 내역이 일치하지 않습니다.")
      : undefined;

  const alertId = e.alert?.id ?? null;

  return {
    id: `EVT-${e.id}`,
    eventId: e.id,
    paymentId: e.paymentId ?? null,
    alertId,
    time: formatTime(e.occurredAt),
    date: formatDate(e.occurredAt),
    paymentMethod,
    status,
    linkedPath: alertId ? `/monitoring/alerts/${alertId}` : null,
    trackingId: e.customer?.trackingKey ? `#${e.customer.trackingKey}` : null,
    note,
  };
}

export function buildPosSummary(txs: PosTransaction[]): PosSummaryStats {
  return {
    totalCount: txs.length,
    normalCount: txs.filter((t) => t.status === "normal").length,
    unpaidCount: txs.filter((t) => t.status === "unpaid").length,
    mismatchCount: txs.filter((t) => t.status === "mismatch").length,
  };
}
