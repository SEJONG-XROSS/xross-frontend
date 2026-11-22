import { create } from "zustand";
import type { AlertSortKey } from "@xross/core";

export type MonitoringMobileTab = "monitor" | "events";
export type ChartMode = "hourly" | "cumulative";

/**
 * 관제 화면의 UI 상태.
 *
 * 알림·이벤트 데이터는 SSE 스트림 훅과 TanStack Query가 갖고,
 * 여기에는 사용자가 고른 화면 상태만 둔다.
 * 데스크톱↔모바일 레이아웃이 바뀌어 패널이 다시 마운트돼도
 * 탭·정렬·차트 모드가 초기화되지 않고, 이벤트 로그 모달은
 * 버튼(AnalyticsPanel)과 모달(EventLogModal)이 props 없이 같은 값을 본다.
 */
interface MonitoringUiState {
  mobileTab: MonitoringMobileTab;
  alertSortKey: AlertSortKey;
  chartMode: ChartMode;
  eventLogOpen: boolean;
  setMobileTab: (tab: MonitoringMobileTab) => void;
  setAlertSortKey: (key: AlertSortKey) => void;
  setChartMode: (mode: ChartMode) => void;
  openEventLog: () => void;
  closeEventLog: () => void;
  resetMonitoringUi: () => void;
}

const INITIAL_STATE = {
  mobileTab: "monitor",
  alertSortKey: "recent",
  chartMode: "hourly",
  eventLogOpen: false,
} satisfies Pick<
  MonitoringUiState,
  "mobileTab" | "alertSortKey" | "chartMode" | "eventLogOpen"
>;

export const useMonitoringUiStore = create<MonitoringUiState>((set) => ({
  ...INITIAL_STATE,

  setMobileTab: (mobileTab) => set({ mobileTab }),
  setAlertSortKey: (alertSortKey) => set({ alertSortKey }),
  setChartMode: (chartMode) => set({ chartMode }),
  openEventLog: () => set({ eventLogOpen: true }),
  closeEventLog: () => set({ eventLogOpen: false }),
  resetMonitoringUi: () => set(INITIAL_STATE),
}));
