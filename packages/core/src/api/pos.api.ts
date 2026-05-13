import { getApiClient } from './client';
import type { PaymentResponse, GetPaymentsParams } from '../types/pos-api';

export function getPayments(params: GetPaymentsParams): Promise<PaymentResponse[]> {
  const p: Record<string, string> = { storeId: String(params.storeId) };
  if (params.limit != null) p.limit = String(params.limit);
  if (params.status) p.status = params.status;
  return getApiClient().get<PaymentResponse[]>('/payments', { params: p }).then((r) => r.data);
}

export function getPayment(id: number): Promise<PaymentResponse> {
  return getApiClient().get<PaymentResponse>(`/payments/${id}`).then((r) => r.data);
}
