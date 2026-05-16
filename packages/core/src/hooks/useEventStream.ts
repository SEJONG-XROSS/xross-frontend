import { useState, useEffect, useRef } from 'react';
import { getEvents } from '../api/monitoring.api';
import { getBaseURL, getStreamAdapter } from '../api/client';
import { isToday, dayBounds } from '../utils/date';
import type { EventResponse } from '../types/monitoring-api';


interface UseEventStreamOptions {
  storeId: number | null;
  accessToken: string | null;
  date: string;
  enabled?: boolean;
}

export function useEventStream({
  storeId,
  accessToken,
  date,
  enabled = true,
}: UseEventStreamOptions) {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!storeId || !accessToken || !enabled) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
      setConnected(false);
      return;
    }

    let mounted = true;
    setEvents([]);
    setConnected(false);
    lastIdRef.current = null;
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (pollRef.current) clearInterval(pollRef.current);

    const bounds = dayBounds(date);
    const fetchFn = () => getEvents(storeId, bounds);

    // 과거 날짜: 데이터가 바뀌지 않으므로 단순 1회 조회
    if (!isToday(date)) {
      fetchFn()
        .then((data) => { if (mounted) { setEvents(data); setConnected(true); } })
        .catch(() => { if (mounted) setConnected(false); });
      return () => { mounted = false; };
    }

    fetchFn().then((data) => {
      if (!mounted) return;
      setEvents(data);
      if (data.length > 0) lastIdRef.current = Math.max(...data.map((e) => e.id));
    }).catch(() => {}).finally(() => {
      if (!mounted) return;
      const qs = new URLSearchParams({ storeId: String(storeId) });
      if (lastIdRef.current != null) qs.set('prevId', String(lastIdRef.current));
      const url = `${getBaseURL()}/events/stream?${qs}`;

      let retryDelay = 1000;
      let retrying = true;

      const connect = () => {
        if (!mounted) return;
        const adapter = getStreamAdapter();
        cleanupRef.current = adapter.open({
          url,
          headers: { Authorization: `Bearer ${accessToken}` },
          onOpen: () => { if (mounted) { setConnected(true); retryDelay = 1000; } },
          onMessage: ({ data }: { data: string }) => {
            if (!mounted) return;
            try {
              const incoming = JSON.parse(data) as EventResponse;
              lastIdRef.current = Math.max(lastIdRef.current ?? 0, incoming.id);
              setEvents((prev) => {
                const idx = prev.findIndex((e: EventResponse) => e.id === incoming.id);
                if (idx !== -1) { const next = [...prev]; next[idx] = incoming; return next; }
                return [incoming, ...prev];
              });
            } catch { /* 파싱 실패 무시 */ }
          },
          onError: () => {
            if (!mounted || !retrying) return;
            setConnected(false);
            cleanupRef.current?.();
            cleanupRef.current = null;
            setTimeout(() => { if (mounted) connect(); }, retryDelay);
            retryDelay = Math.min(retryDelay * 2, 30_000);
          },
        });
      };

      connect();
      return () => { retrying = false; };
    });

    return () => {
      mounted = false;
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storeId, accessToken, date, enabled]);

  return { events, connected };
}
