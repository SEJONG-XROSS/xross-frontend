export type TransactionStatus = "normal" | "unpaid" | "mismatch";
export type PaymentMethod = "card" | "cash" | "mobile" | "qr_code";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export type StatusFilterOption = "all" | "normal" | "unpaid" | "mismatch";
export type PaymentFilterOption = "all" | "card" | "cash" | "mobile" | "qr_code";

export interface PosTransaction {
  id: string;
  eventId: number;
  paymentId: number | null;
  alertId: number | null;
  time: string;
  date: string;
  paymentMethod: PaymentMethod | null;
  status: TransactionStatus;
  linkedPath: string | null;
  trackingId: string | null;
  note?: string;
}

export interface PosSummaryStats {
  totalCount: number;
  normalCount: number;
  unpaidCount: number;
  mismatchCount: number;
}
