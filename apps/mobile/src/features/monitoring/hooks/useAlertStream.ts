import { useState, useEffect, useRef } from "react";
import {
  getAlerts,
  getBaseURL,
  getStreamAdapter,
  isToday,
  dayBounds,
} from "@xross/core";
import { useAuthStore } from "@/shared/auth/store";
import type { AlertResponse } from "@xross/core";

const POLL_INTERVAL = 30_000;

export function useAlertStream(date: string) {
  const storeId = useAuthStore((s) => s.storeId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!storeId || !accessToken) return;

    let mounted = true;
    setAlerts([]);
    setConnected(false);
    lastIdRef.current = null;
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (pollRef.current) clearInterval(pollRef.current);

    const bounds = dayBounds(date);
    const fetchFn = () => getAlerts(storeId, bounds);

    const startPolling = (interval: number) => {
      fetchFn()
        .then((data) => {
          if (mounted) {
            setAlerts(data);
            setConnected(true);
          }
        })
        .catch((e) => {
          if (__DEV__) console.warn('[AlertStream] poll error:', e?.message);
          if (mounted) setConnected(false);
        });
      pollRef.current = setInterval(() => {
        if (!mounted) return;
        fetchFn()
          .then((data) => {
            if (mounted) {
              setAlerts(data);
              setConnected(true);
            }
          })
          .catch(() => {
            if (mounted) setConnected(false);
          });
      }, interval);
    };

    if (!isToday(date)) {
      startPolling(POLL_INTERVAL);
      return () => {
        mounted = false;
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }

    // 오늘: 초기 REST → SSE
    fetchFn()
      .then((data) => {
        if (!mounted) return;
        setAlerts(data);
        if (data.length > 0)
          lastIdRef.current = Math.max(...data.map((a) => a.id));
      })
      .catch((e) => {
        if (__DEV__) console.warn('[AlertStream] initial fetch error:', e?.message);
      })
      .finally(() => {
        if (!mounted) return;
        const qs = new URLSearchParams({ storeId: String(storeId) });
        if (lastIdRef.current != null)
          qs.set("prevId", String(lastIdRef.current));
        const url = `${getBaseURL()}/alerts/stream?${qs}`;

        let retryDelay = 1000;
        let retrying = true;

        const connect = () => {
          if (!mounted) return;
          const adapter = getStreamAdapter();
          cleanupRef.current = adapter.open({
            url,
            headers: { Authorization: `Bearer ${accessToken}` },
            onOpen: () => {
              if (mounted) {
                setConnected(true);
                retryDelay = 1000;
              }
            },
            onMessage: ({ data }) => {
              if (!mounted) return;
              try {
                const incoming = JSON.parse(data) as AlertResponse;
                lastIdRef.current = Math.max(
                  lastIdRef.current ?? 0,
                  incoming.id,
                );
                setAlerts((prev) => {
                  const idx = prev.findIndex((a) => a.id === incoming.id);
                  if (idx !== -1) {
                    const next = [...prev];
                    next[idx] = incoming;
                    return next;
                  }
                  return [incoming, ...prev];
                });
              } catch {
                /* 파싱 실패 무시 */
              }
            },
            onError: (e) => {
              if (__DEV__) console.warn('[AlertStream] SSE error:', e?.message);
              if (!mounted || !retrying) return;
              setConnected(false);
              cleanupRef.current?.();
              cleanupRef.current = null;
              setTimeout(() => {
                if (mounted) connect();
              }, retryDelay);
              retryDelay = Math.min(retryDelay * 2, 30_000);
            },
          });
        };

        connect();
        return () => {
          retrying = false;
        };
      });

    return () => {
      mounted = false;
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storeId, accessToken, date]);

  return { alerts, connected };
}
