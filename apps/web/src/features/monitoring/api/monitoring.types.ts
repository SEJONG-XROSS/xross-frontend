export interface EventCustomerResponse {
  id: number;
  trackingKey: string;
  userId?: number | null;
  enterTime?: string | null;
  exitTime?: string | null;
  state?: "PAID" | "UNPAID_SUSPICIOUS" | "BROWSE" | string | null;
  currentZone?: string | null;
  lastSeenAt?: string | null;
  isTrackingEnded?: boolean | null;
}

export interface EventProductResponse {
  id: number;
  name: string;
  sku: string;
  price: number | string;
  weightPerUnitG?: number | null;
  unitWeightG?: number | null;
  category?: string | null;
  expectedStockCount?: number | null;
  isActive?: boolean | null;
}

export interface EventFreezerResponse {
  id: number;
  code: string;
  name?: string | null;
}

export type EventType =
  | "ENTER" | "LOCATION_UPDATE" | "SENSOR_TRIGGER"
  | "PICK" | "PUT" | "BROWSE_ONLY" | "CART_UPDATED"
  | "PAYMENT_RECEIVED" | "PAYMENT_MATCHED" | "PAYMENT_MISMATCH"
  | "UNPAID_SUSPICIOUS" | "EXIT_LINE_CROSSED"
  | "LONG_STAY" | "FALL_DETECTED" | "ALERT_SENT";

export type EventSource =
  | "CEILING_CAMERA" | "FREEZER_CAMERA" | "WEIGHT_SENSOR" | "POS";

export interface EventAlertSummary {
  id: number;
  title: string;
  priority: "WARNING" | "CRITICAL";
  status: "PENDING" | "SENT" | "FAILED" | "ACKNOWLEDGED";
}

export interface EventResponse {
  id: number;
  type: EventType;
  source: EventSource;
  occurredAt: string;
  createdAt: string;
  storeId: number;
  quantityDelta?: number | null;
  weightBeforeG?: number | null;
  weightAfterG?: number | null;
  predictedItemCount?: number | null;
  confidence?: number | null;
  location?: unknown | null;
  message?: string | null;
  metadata?: unknown | null;
  customerId?: number | null;
  productId?: number | null;
  freezerId?: number | null;
  deviceId?: number | null;
  paymentId?: number | null;
  customer?: EventCustomerResponse | null;
  product?: EventProductResponse | null;
  freezer?: EventFreezerResponse | null;
  alert?: EventAlertSummary | null;
}

export type AlertChannel = "WEB" | "MOBILE" | "SPEAKER";
export type AlertStatus = "PENDING" | "SENT" | "FAILED" | "ACKNOWLEDGED";
export type AlertPriority = "WARNING" | "CRITICAL";

export interface AlertResponse {
  id: number;
  title: string;
  message: string;
  channel: AlertChannel;
  status: AlertStatus;
  priority: AlertPriority;
  storeId: number;
  createdAt: string;
  relatedEventIds: number[];
  customerId?: number | null;
  customer?: EventCustomerResponse | null;
  store?: { id: number; name: string; code: string } | null;
  acknowledgedBy?: { id: number; name: string; email: string } | null;
}

export type EventDetailType =
  | "CUSTOMER_ENTER" | "CUSTOMER_EXIT" | "ITEM_PICKED"
  | "ITEM_RETURNED" | "WEIGHT_CHANGE" | "PAYMENT_COMPLETED";

export type EventDetailStatus =
  | "PENDING" | "PROCESSED" | "MATCHED" | "IGNORED" | "ERROR";

export interface EventDetailResponse {
  id: number;
  type: EventDetailType;
  source: EventSource;
  status: EventDetailStatus;
  occurredAt: string;
  createdAt: string;
  storeId?: number;
  customerId?: number | null;
  freezerId?: number | null;
  productId?: number | null;
  matchedEventId?: number | null;
  detectedProductSku?: string | null;
  action?: string | null;
  confidence?: number | null;
  weightBeforeG?: number | null;
  weightAfterG?: number | null;
  weightDeltaG?: number | null;
  processedAt?: string | null;
  errorMessage?: string | null;
}
