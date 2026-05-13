export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";
export type ApiPaymentMethod = "CARD" | "CASH" | "MOBILE_PAY" | "QR_CODE";

export interface PaymentItemResponse {
  id: number;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
  productId: number;
  product?: {
    id: number;
    name: string;
    sku: string;
    price: number | string;
  } | null;
}

export interface PaymentCustomerResponse {
  id: number;
  trackingKey: string;
}

export interface PaymentCartResponse {
  id: number;
  totalCount: number;
  totalWeightG: number;
  isCheckedOut: boolean;
}

export interface PaymentResponse {
  id: number;
  externalPaymentId?: string | null;
  totalCount: number;
  totalAmount: number | string;
  paidAt: string;
  status: PaymentStatus;
  paymentMethod: ApiPaymentMethod;
  isMatchedToCart: boolean;
  storeId: number;
  customerId: number;
  cartId?: number | null;
  createdAt: string;
  updatedAt: string;
  items: PaymentItemResponse[];
  customer?: PaymentCustomerResponse | null;
  cart?: PaymentCartResponse | null;
}

export interface GetPaymentsParams {
  storeId: number;
  limit?: number;
  status?: PaymentStatus;
}
