import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { BASE_URL } from "@/shared/lib/api";
import { getAlerts } from "@/features/monitoring/api/monitoring.api";
import { isToday, dayBounds } from "@/shared/lib/date";
import type { AlertResponse } from "@/features/monitoring/api/monitoring.types";

const SSE_POLL_INTERVAL = 5_000;
const PAST_POLL_INTERVAL = 60_000;

export function useAlertStream(date: string) {
  const storeId = useAuthStore((s) => s.storeId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!storeId || !Number.isInteger(storeId) || !accessToken) return;

    let mounted = true;
    let retryDelay = 1000;
    let currentAbort: AbortController | null = null;

    setAlerts([]);
    setConnected(false);
    lastIdRef.current = null;
    if (pollRef.current) clearInterval(pollRef.current);

    const currentDay = isToday(date);
    const bounds = dayBounds(date);

    const fetchForDate = () => getAlerts(storeId, bounds);

    const upsertOne = (incoming: AlertResponse) => {
      lastIdRef.current = Math.max(lastIdRef.current ?? 0, incoming.id);
      setAlerts((prev) => {
        const idx = prev.findIndex((a) => a.id === incoming.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = incoming;
          return next;
        }
        return [incoming, ...prev];
      });
    };

    /** REST 재조회 결과를 id 기준으로 병합 — 초기 조회와 구독 시작 사이 공백 보정용 */
    const upsertMany = (incoming: AlertResponse[]) => {
      if (incoming.length === 0) return;
      lastIdRef.current = Math.max(
        lastIdRef.current ?? 0,
        ...incoming.map((a) => a.id),
      );
      setAlerts((prev) => {
        const known = new Set(prev.map((a) => a.id));
        const added = incoming.filter((a) => !known.has(a.id));
        return added.length === 0 ? prev : [...prev, ...added];
      });
    };

    const startPolling = (interval: number) => {
      if (!mounted) return;
      fetchForDate()
        .then((data) => { if (mounted) { setAlerts(data); setConnected(true); } })
        .catch(() => { if (mounted) setConnected(false); });

      pollRef.current = setInterval(() => {
        if (!mounted) return;
        fetchForDate()
          .then((data) => { if (mounted) { setAlerts(data); setConnected(true); } })
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

    // 오늘: REST로 초기 데이터 → SSE로 신규 알림 수신
    const initAndConnect = async () => {
      try {
        const initial = await fetchForDate();
        if (!mounted) return;
        setAlerts(initial);
        if (initial.length > 0) {
          lastIdRef.current = Math.max(...initial.map((a) => a.id));
        }
      } catch {
        // 초기 패치 실패해도 SSE 연결은 시도
      }

      connect();
    };

    const connect = async () => {
      if (!mounted) return;
      currentAbort = new AbortController();

      const scheduleReconnect = () => {
        if (!mounted) return;
        setConnected(false);
        setTimeout(() => { if (mounted) connect(); }, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30_000);
      };

      try {
        setConnected(false);
        const hadPrevId = lastIdRef.current != null;
        const qs = new URLSearchParams({ storeId: String(storeId) });
        if (lastIdRef.current != null) qs.set("prevId", String(lastIdRef.current));

        const response = await fetch(`${BASE_URL}/alerts/stream?${qs}`, {
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

        // prevId 없이 구독한 연결: 초기 REST와 구독 시작 사이에 생성된
        // 알림은 양쪽 어디에도 없으므로 한 번 재조회해 공백을 메운다.
        if (!hadPrevId) {
          fetchForDate()
            .then((data) => { if (mounted) upsertMany(data); })
            .catch(() => {});
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let dataLines: string[] = [];

        // SSE 규격상 빈 줄이 이벤트 경계이고 data:가 여러 줄이면 \n으로 이어붙인다.
        // 다만 완전한 JSON이 만들어지는 즉시 디스패치해, 경계 빈 줄을 생략하는
        // 비규격 서버에서도 알림이 누적된 채 묻히지 않게 한다.
        const tryDispatch = (atBoundary: boolean) => {
          if (dataLines.length === 0) return;
          const raw = dataLines.join("\n");
          try {
            const parsed = JSON.parse(raw) as AlertResponse;
            dataLines = [];
            upsertOne(parsed);
          } catch {
            // 경계(빈 줄)에서도 파싱 불가면 폐기, 아니면 다음 줄과 이어붙여 재시도
            if (atBoundary) dataLines = [];
          }
        };

        while (mounted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
            if (line === "") {
              tryDispatch(true);
              continue;
            }
            if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).replace(/^ /, ""));
              tryDispatch(false);
            }
            // event:/id:/retry:/주석(:) 필드는 사용하지 않으므로 무시
          }
        }

        // 서버·프록시가 스트림을 정상 종료한 경우(done) — 예외가 아니므로
        // 기존엔 여기서 멈춰 "연결됨" 표시인 채 알림이 오지 않았다. 재연결로 복구.
        scheduleReconnect();
      } catch (err) {
        if (!mounted || (err as Error).name === "AbortError") return;
        scheduleReconnect();
      }
    };

    initAndConnect();

    return () => {
      mounted = false;
      currentAbort?.abort();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storeId, accessToken, date]);

  return { alerts, connected };
}
