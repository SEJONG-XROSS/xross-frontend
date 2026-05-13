import { apiFetch } from "@/shared/lib/api";
import type {
  EventResponse,
  AlertResponse,
  EventDetailResponse,
} from "./monitoring.types";

export function getEvents(
  storeId: number,
  params?: { startDate?: string; endDate?: string; prevId?: number },
): Promise<EventResponse[]> {
  const qs = new URLSearchParams({ storeId: String(storeId) });
  if (params?.startDate) qs.set("startDate", params.startDate);
  if (params?.endDate) qs.set("endDate", params.endDate);
  if (params?.prevId != null) qs.set("prevId", String(params.prevId));
  return apiFetch(`/events?${qs}`);
}

export function getEvent(eventId: number): Promise<EventResponse> {
  return apiFetch(`/events/${eventId}`);
}

export function getAlerts(
  storeId: number,
  params?: { startDate?: string; endDate?: string; prevId?: number },
): Promise<AlertResponse[]> {
  const qs = new URLSearchParams({ storeId: String(storeId) });
  if (params?.startDate) qs.set("startDate", params.startDate);
  if (params?.endDate) qs.set("endDate", params.endDate);
  if (params?.prevId != null) qs.set("prevId", String(params.prevId));
  return apiFetch(`/alerts?${qs}`);
}

export function getAlert(alertId: number): Promise<AlertResponse> {
  return apiFetch(`/alerts/${alertId}`);
}

export function getEventDetails(
  eventId: number,
): Promise<EventDetailResponse[]> {
  return apiFetch(`/event-details/event/${eventId}`);
}

export function acknowledgeAlert(
  alertId: number,
  userId: number,
): Promise<AlertResponse> {
  return apiFetch(`/alerts/${alertId}/acknowledge`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
