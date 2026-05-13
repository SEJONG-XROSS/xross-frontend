import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { BASE_URL } from "@/shared/lib/api";
import { getEvents } from "@/features/monitoring/api/monitoring.api";
import { isToday, dayBounds } from "@/shared/lib/date";
import type { EventResponse } from "@/features/monitoring/api/monitoring.types";

const SSE_POLL_INTERVAL = 10_000;
const PAST_POLL_INTERVAL = 60_000;

export function useEventStream(date: string) {
  const storeId = useAuthStore((s) => s.storeId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!storeId || !Number.isInteger(storeId) || !accessToken) return;

    let mounted = true;
    let retryDelay = 1000;
    let currentAbort: AbortController | null = null;

    setEvents([]);
    setConnected(false);
    lastIdRef.current = null;
    if (pollRef.current) clearInterval(pollRef.current);

    const currentDay = isToday(date);
    const bounds = dayBounds(date);

    const fetchForDate = () => getEvents(storeId, bounds);

    const startPolling = (interval: number) => {
      if (!mounted) return;
      fetchForDate()
        .then((data) => { if (mounted) { setEvents(data); setConnected(true); } })
        .catch(() => { if (mounted) setConnected(false); });

      pollRef.current = setInterval(() => {
        if (!mounted) return;
        fetchForDate()
          .then((data) => { if (mounted) { setEvents(data); setConnected(true); } })
          .catch(() => { if (mounted) setConnected(false); });
      }, interval);
    };

    if (!currentDay) {
      startPolling(PAST_POLL_INTERVAL);
      return () => {
        mounted = false;
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }

    // 오늘: REST로 초기 데이터 → SSE로 신규 이벤트 수신
    const initAndConnect = async () => {
      // 1) REST로 초기 데이터 패치
      try {
        const initial = await fetchForDate();
        if (!mounted) return;
        setEvents(initial);
        if (initial.length > 0) {
          lastIdRef.current = Math.max(...initial.map((e) => e.id));
        }
      } catch {
        // 초기 패치 실패해도 SSE 연결은 시도
      }

      // 2) SSE 연결 (prevId로 REST 이후 누락 이벤트 이어받기)
      connect();
    };

    const connect = async () => {
      if (!mounted) return;
      currentAbort = new AbortController();

      try {
        setConnected(false);
        const qs = new URLSearchParams({ storeId: String(storeId) });
        if (lastIdRef.current != null) qs.set("prevId", String(lastIdRef.current));

        const response = await fetch(`${BASE_URL}/events/stream?${qs}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "text/event-stream",
          },
          signal: currentAbort.signal,
        });

        if (response.status >= 400 && response.status < 500) {
          startPolling(SSE_POLL_INTERVAL);
          return;
        }

        if (!response.ok || !response.body) {
          throw new Error(`SSE 연결 실패: ${response.status}`);
        }

        setConnected(true);
        retryDelay = 1000;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (mounted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw) continue;
            try {
              const incoming = JSON.parse(raw) as EventResponse;
              lastIdRef.current = Math.max(lastIdRef.current ?? 0, incoming.id);
              setEvents((prev) => {
                const idx = prev.findIndex((e) => e.id === incoming.id);
                if (idx !== -1) {
                  const next = [...prev];
                  next[idx] = incoming;
                  return next;
                }
                return [incoming, ...prev];
              });
            } catch {
              // 파싱 실패 무시
            }
          }
        }
      } catch (err) {
        if (!mounted || (err as Error).name === "AbortError") return;
        setConnected(false);
        setTimeout(() => { if (mounted) connect(); }, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30_000);
      }
    };

    initAndConnect();

    return () => {
      mounted = false;
      currentAbort?.abort();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storeId, accessToken, date]);

  return { events, connected };
}
