import { getApiClient } from './client';
import type { EventResponse, AlertResponse, EventDetailResponse, VideoPlaybackResponse } from '../types/monitoring-api';

export function getEvents(
  storeId: number,
  params?: { startDate?: string; endDate?: string; prevId?: number },
): Promise<EventResponse[]> {
  const p: Record<string, string> = { storeId: String(storeId) };
  if (params?.startDate) p.startDate = params.startDate;
  if (params?.endDate) p.endDate = params.endDate;
  if (params?.prevId != null) p.prevId = String(params.prevId);
  return getApiClient().get<EventResponse[]>('/events', { params: p }).then((r) => r.data);
}

export function getEvent(eventId: number): Promise<EventResponse> {
  return getApiClient().get<EventResponse>(`/events/${eventId}`).then((r) => r.data);
}

export function getAlerts(
  storeId: number,
  params?: { startDate?: string; endDate?: string; prevId?: number },
): Promise<AlertResponse[]> {
  const p: Record<string, string> = { storeId: String(storeId) };
  if (params?.startDate) p.startDate = params.startDate;
  if (params?.endDate) p.endDate = params.endDate;
  if (params?.prevId != null) p.prevId = String(params.prevId);
  return getApiClient().get<AlertResponse[]>('/alerts', { params: p }).then((r) => r.data);
}

export function getAlert(alertId: number): Promise<AlertResponse> {
  return getApiClient().get<AlertResponse>(`/alerts/${alertId}`).then((r) => r.data);
}

export function getEventDetails(eventId: number): Promise<EventDetailResponse[]> {
  return getApiClient()
    .get<EventDetailResponse[]>(`/event-details/event/${eventId}`)
    .then((r) => r.data);
}

export function acknowledgeAlert(alertId: number, userId: number): Promise<AlertResponse> {
  return getApiClient()
    .post<AlertResponse>(`/alerts/${alertId}/acknowledge`, { userId })
    .then((r) => r.data);
}

export function getVideoPlayback(alertId: number): Promise<VideoPlaybackResponse> {
  return getApiClient().get<VideoPlaybackResponse>(`/videos/playback/${alertId}`).then((r) => r.data);
}
