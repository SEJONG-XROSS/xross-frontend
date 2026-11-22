import { create } from "zustand";
import type {
  DateRange,
  StatusFilterOption,
  PaymentFilterOption,
} from "@/features/pos/types/pos.types";

/**
 * POS 거래 내역 화면의 필터 상태.
 *
 * 서버에서 받은 거래 목록은 TanStack Query(usePosTransactions)가 갖고,
 * 여기에는 사용자가 고른 검색어·기간·상태·결제수단만 둔다.
 * 페이지를 벗어났다 돌아와도 필터가 유지되고, 검색바가 props 없이 직접 갱신한다.
 */
export interface PosFilters {
  search: string;
  dateRange: DateRange;
  status: StatusFilterOption;
  payment: PaymentFilterOption;
}

const INITIAL_FILTERS: PosFilters = {
  search: "",
  dateRange: { from: null, to: null },
  status: "all",
  payment: "all",
};

interface PosFilterState {
  filters: PosFilters;
  setSearch: (search: string) => void;
  setDateRange: (dateRange: DateRange) => void;
  setStatus: (status: StatusFilterOption) => void;
  setPayment: (payment: PaymentFilterOption) => void;
  resetFilters: () => void;
}

export const usePosFilterStore = create<PosFilterState>((set) => ({
  filters: INITIAL_FILTERS,

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setDateRange: (dateRange) =>
    set((s) => ({ filters: { ...s.filters, dateRange } })),
  setStatus: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setPayment: (payment) => set((s) => ({ filters: { ...s.filters, payment } })),
  resetFilters: () => set({ filters: INITIAL_FILTERS }),
}));
