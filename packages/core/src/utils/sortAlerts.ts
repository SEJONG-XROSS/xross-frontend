import type { AlertResponse, AlertPriority } from '../types/monitoring-api';

export type AlertSortKey = 'recent' | 'priority';

const PRIORITY_RANK: Record<AlertPriority, number> = {
  CRITICAL: 0,
  WARNING: 1,
};

/**
 * 알림 정렬.
 * - recent: createdAt 내림차순 (최신순)
 * - priority: CRITICAL → WARNING, 같은 priority 내에서는 최신순
 */
export function sortAlerts(
  alerts: AlertResponse[],
  key: AlertSortKey,
): AlertResponse[] {
  const copy = [...alerts];
  if (key === 'priority') {
    copy.sort((a, b) => {
      const diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (diff !== 0) return diff;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  } else {
    copy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return copy;
}
