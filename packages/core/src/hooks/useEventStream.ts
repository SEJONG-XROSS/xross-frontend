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

    /** REST 재조회 결과를 id 기준으로 병합 — 초기 조회와 구독 시작 사이 공백 보정용 */
    const upsertMany = (incoming: EventResponse[]) => {
      if (incoming.length === 0) return;
      lastIdRef.current = Math.max(lastIdRef.current ?? 0, ...incoming.map((e) => e.id));
      setEvents((prev) => {
        const known = new Set(prev.map((e) => e.id));
        const added = incoming.filter((e) => !known.has(e.id));
        return added.length === 0 ? prev : [...prev, ...added];
      });
    };

    fetchFn().then((data) => {
      if (!mounted) return;
      setEvents(data);
      if (data.length > 0) lastIdRef.current = Math.max(...data.map((e) => e.id));
    }).catch(() => {}).finally(() => {
      if (!mounted) return;

      let retryDelay = 1000;

      const connect = () => {
        if (!mounted) return;
        // URL은 매 연결마다 새로 구성 — 재연결 시 최신 prevId로 누락분을 이어받는다.
        const qs = new URLSearchParams({ storeId: String(storeId) });
        if (lastIdRef.current != null) qs.set('prevId', String(lastIdRef.current));

        const adapter = getStreamAdapter();
        cleanupRef.current = adapter.open({
          url: `${getBaseURL()}/events/stream?${qs}`,
          headers: { Authorization: `Bearer ${accessToken}` },
          onOpen: () => {
            if (!mounted) return;
            setConnected(true);
            retryDelay = 1000;
            // prevId 없이 구독한 연결: 초기 REST와 구독 시작 사이에 생성된
            // 이벤트는 양쪽 어디에도 없으므로 한 번 재조회해 공백을 메운다.
            if (lastIdRef.current == null) {
              fetchFn().then((data) => { if (mounted) upsertMany(data); }).catch(() => {});
            }
          },
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
            if (!mounted) return;
            setConnected(false);
            cleanupRef.current?.();
            cleanupRef.current = null;
            setTimeout(() => { if (mounted) connect(); }, retryDelay);
            retryDelay = Math.min(retryDelay * 2, 30_000);
          },
        });
      };

      connect();
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
