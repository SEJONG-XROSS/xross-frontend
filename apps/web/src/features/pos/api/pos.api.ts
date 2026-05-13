import { apiFetch } from "@/shared/lib/api";
import type { PaymentResponse, GetPaymentsParams } from "./pos.types";

export function getPayments(params: GetPaymentsParams): Promise<PaymentResponse[]> {
  const { storeId, limit, status } = params;
  const qs = new URLSearchParams({ storeId: String(storeId) });
  if (limit != null) qs.set("limit", String(limit));
  if (status) qs.set("status", status);
  return apiFetch(`/payments?${qs}`);
}

export function getPayment(id: number): Promise<PaymentResponse> {
  return apiFetch(`/payments/${id}`);
}
