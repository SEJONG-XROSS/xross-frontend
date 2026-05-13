import { useState } from "react";
import { useNavigate } from "react-router";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?react";
import ExternalLinkIcon from "@/assets/icons/external-link.svg?react";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import PosStatusBadge from "@/features/pos/components/PosStatusBadge";
import PosPaymentMethod from "@/features/pos/components/PosPaymentMethod";
import { usePayment } from "@/features/pos/hooks/usePayment";
import type { PosTransaction } from "@/features/pos/types/pos.types";

/* ── 확장 상세 패널 ──────────────────────────── */
interface TransactionDetailProps {
  tx: PosTransaction;
}

function TransactionDetail({ tx }: TransactionDetailProps) {
  const navigate = useNavigate();
  const { data: payment, isLoading } = usePayment(tx.paymentId);

  const isUnpaid = tx.status === "unpaid";
  const isMismatch = tx.status === "mismatch";

  const items = payment?.items ?? [];
  const total = Number(payment?.totalAmount ?? 0);
  const detectedMismatch = payment != null && !payment.isMatchedToCart;

  return (
    <tr className="border-monitor-border border-b">
      <td
        colSpan={7}
        className={`px-6 pt-2 pb-4 ${
          isUnpaid
            ? "bg-[rgba(251,44,54,0.06)]"
            : isMismatch
              ? "bg-[rgba(254,200,0,0.06)]"
              : "bg-[rgba(255,255,255,0.03)]"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          {/* 결제 상품 내역 */}
          <div className="flex-1 overflow-x-auto">
            <p className="text-monitor-text-dim mb-[9px] text-[11px] font-medium tracking-wider uppercase">
              결제 상품
            </p>

            {isUnpaid ? (
              <div className="flex items-center gap-2 rounded-lg border border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.07)] px-4 py-3">
                <ShieldAlertIcon className="h-4 w-4 shrink-0 text-[#ff6467]" />
                <span className="text-[13px] text-[#ff6467]">
                  결제 기록 없음 — 미결제 퇴장 감지됨
                </span>
              </div>
            ) : isLoading ? (
              <p className="text-monitor-text-muted text-[13px]">로딩 중...</p>
            ) : items.length === 0 ? (
              <p className="text-monitor-text-muted text-[13px]">
                상품 정보 없음
              </p>
            ) : (
              <>
                {detectedMismatch && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-[rgba(254,154,0,0.25)] bg-[rgba(254,154,0,0.08)] px-3 py-2">
                    <TriangleAlertIcon className="text-event-warning h-3.5 w-3.5 shrink-0" />
                    <span className="text-event-warning text-[12px]">
                      장바구니 수량·품목과 결제 내역이 일치하지 않습니다
                    </span>
                  </div>
                )}
                <table className="w-full max-w-[814px]">
                  <thead>
                    <tr className="border-monitor-border border-b">
                      <th className="text-monitor-text-dim pb-[7px] text-left text-[11px] font-medium">
                        상품명
                      </th>
                      <th className="text-monitor-text-dim w-10 pb-[7px] text-right text-[11px] font-medium">
                        수량
                      </th>
                      <th className="text-monitor-text-dim w-24 pb-[7px] text-right text-[11px] font-medium">
                        단가
                      </th>
                      <th className="text-monitor-text-dim w-24 pb-[7px] text-right text-[11px] font-medium">
                        소계
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-monitor-border border-b"
                      >
                        <td className="text-monitor-text py-[4.5px] text-[13px]">
                          {item.product?.name ?? `상품 #${item.productId}`}
                        </td>
                        <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                          {item.quantity}
                        </td>
                        <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                          {Number(item.unitPrice).toLocaleString("ko-KR")}원
                        </td>
                        <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                          {Number(item.subtotal).toLocaleString("ko-KR")}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="text-monitor-text-dim pt-[6px] text-right text-[11px] font-medium"
                      >
                        합계
                      </td>
                      <td className="text-monitor-text pt-[6px] text-right text-[13px] font-semibold">
                        {total.toLocaleString("ko-KR")}원
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="w-full shrink-0 sm:w-[224px]">
            <p className="text-monitor-text-dim mb-[8px] text-[11px] font-medium tracking-wider uppercase">
              상세 정보
            </p>
            <div className="flex flex-col gap-[8px]">
              {tx.trackingId && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-monitor-text-dim">비전 AI 추적 ID</span>
                  <span
                    className={`font-medium ${
                      isUnpaid ? "text-[#ff6467]" : "text-monitor-text-muted"
                    }`}
                  >
                    {tx.trackingId}
                  </span>
                </div>
              )}
              {payment && (
                <>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-monitor-text-dim">결제 총액</span>
                    <span className="text-monitor-text font-semibold">
                      {total.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                  {payment.externalPaymentId && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-monitor-text-dim">결제 ID</span>
                      <span className="text-monitor-text-muted font-mono text-[11px]">
                        {payment.externalPaymentId}
                      </span>
                    </div>
                  )}
                </>
              )}
              {tx.note && (
                <div
                  className={`mt-1 rounded-md border px-[11px] py-[11px] ${
                    isUnpaid
                      ? "border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.08)]"
                      : "border-[rgba(254,154,0,0.2)] bg-[rgba(254,154,0,0.07)]"
                  }`}
                >
                  <p
                    className={`text-[11px] leading-[17px] ${
                      isUnpaid ? "text-[#ff6467]" : "text-event-warning"
                    }`}
                  >
                    {tx.note}
                  </p>
                </div>
              )}
              {tx.linkedPath && (
                <button
                  type="button"
                  onClick={() => navigate(tx.linkedPath!)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)] px-3 py-[8px] text-[12px] font-medium text-[#ff6467] transition-colors hover:bg-[rgba(251,44,54,0.15)]"
                >
                  <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                  알림 상세 검토 →
                </button>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ── 트랜잭션 행 ─────────────────────────────── */
interface TransactionRowProps {
  tx: PosTransaction;
  isExpanded: boolean;
  onToggle: () => void;
}

function TransactionRow({ tx, isExpanded, onToggle }: TransactionRowProps) {
  const ChevronIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
  const isUnpaid = tx.status === "unpaid";
  const isMismatch = tx.status === "mismatch";

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-monitor-border cursor-pointer border-b transition-colors ${
          isUnpaid
            ? "bg-[rgba(251,44,54,0.08)] hover:bg-[rgba(251,44,54,0.13)]"
            : isMismatch
              ? "bg-[rgba(254,200,0,0.07)] hover:bg-[rgba(254,200,0,0.12)]"
              : isExpanded
                ? "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.05)]"
                : "hover:bg-[rgba(255,255,255,0.03)]"
        }`}
      >
        {/* 시각 / ID */}
        <td className="px-4 py-[12.5px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-monitor-text text-[13px] leading-4 font-medium">
              {tx.time}
            </span>
            <span className="text-monitor-text-dim font-mono text-[11px] leading-[15px]">
              {tx.id}
            </span>
          </div>
        </td>

        {/* 날짜 */}
        <td className="px-4 py-[12.5px]">
          <span className="text-monitor-text-muted text-[13px] leading-4">
            {tx.date}
          </span>
        </td>

        {/* 상태 */}
        <td className="px-4 py-[12.5px]">
          <PosStatusBadge status={tx.status} />
        </td>

        {/* 추적 ID */}
        <td className="px-4 py-[12.5px]">
          {tx.trackingId ? (
            <span
              className={`font-mono text-[12px] ${
                isUnpaid ? "text-[#ff6467]" : "text-monitor-text-muted"
              }`}
            >
              {tx.trackingId}
            </span>
          ) : (
            <span className="text-monitor-text-dim text-[13px]">—</span>
          )}
        </td>

        {/* 결제 수단 */}
        <td className="px-4 py-[12.5px]">
          {tx.paymentMethod ? (
            <PosPaymentMethod method={tx.paymentMethod} />
          ) : (
            <span className="text-monitor-text-dim text-[13px]">—</span>
          )}
        </td>

        {/* 결제 정보 여부 */}
        <td className="px-4 py-[12.5px]">
          {isUnpaid ? (
            <span className="text-[12px] text-[#ff6467]">없음</span>
          ) : tx.paymentId ? (
            <span className="text-monitor-text-dim font-mono text-[11px]">
              #{tx.paymentId}
            </span>
          ) : (
            <span className="text-monitor-text-dim text-[13px]">—</span>
          )}
        </td>

        {/* 확장 토글 */}
        <td className="px-4 py-[12.5px]">
          <div className="flex items-center justify-center">
            <ChevronIcon className="text-monitor-text-dim h-[14px] w-[14px]" />
          </div>
        </td>
      </tr>

      {isExpanded && <TransactionDetail tx={tx} />}
    </>
  );
}

/* ── PosTransactionTable ─────────────────────── */
interface PosTransactionTableProps {
  transactions: PosTransaction[];
  totalCount: number;
  isLoading?: boolean;
}

const COL_HEADERS: { label: string; align: "left" | "right" }[] = [
  { label: "시각 / ID", align: "left" },
  { label: "날짜", align: "left" },
  { label: "상태", align: "left" },
  { label: "추적 ID", align: "left" },
  { label: "결제 수단", align: "left" },
  { label: "결제", align: "right" },
  { label: "", align: "left" },
];

export default function PosTransactionTable({
  transactions,
  totalCount,
  isLoading = false,
}: PosTransactionTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function handleToggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="border-monitor-border bg-monitor-card-bg overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-monitor-border border-b bg-[rgba(255,255,255,0.04)]">
              {COL_HEADERS.map((col, i) => (
                <th
                  key={i}
                  className={`text-monitor-text-dim px-4 py-[10px] text-[11px] font-medium tracking-wider uppercase ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${i === COL_HEADERS.length - 1 ? "w-12" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-monitor-text-muted px-4 py-8 text-center text-sm"
                >
                  로딩 중...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-monitor-text-muted px-4 py-8 text-center text-sm"
                >
                  거래 내역이 없습니다.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  isExpanded={expandedIds.has(tx.id)}
                  onToggle={() => handleToggle(tx.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-monitor-border flex flex-col items-start gap-1 border-t px-4 py-[10px] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <span className="text-monitor-text-dim text-[12px]">
          {transactions.length}건 표시 중 (전체 {totalCount}건)
        </span>
        <span className="text-monitor-text-dim text-[11px]">
          행을 클릭하면 결제 상세 내역을 확인할 수 있습니다
        </span>
      </div>
    </div>
  );
}
