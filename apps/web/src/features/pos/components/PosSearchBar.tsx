import { useState } from "react";
import SearchIcon from "@/assets/icons/search.svg?react";
import DateRangePicker from "@/features/pos/components/DateRangePicker";
import FilterDropdown from "@/features/pos/components/FilterDropdown";
import type {
  DateRange,
  StatusFilterOption,
  PaymentFilterOption,
} from "@/features/pos/types/pos.types";

const STATUS_OPTIONS: { value: StatusFilterOption; label: string }[] = [
  { value: "all", label: "전체 상태" },
  { value: "normal", label: "정상 결제" },
  { value: "unpaid", label: "미결제 의심" },
  { value: "mismatch", label: "장바구니 불일치" },
];

const PAYMENT_OPTIONS: { value: PaymentFilterOption; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "card", label: "카드" },
  { value: "cash", label: "현금" },
  { value: "mobile", label: "모바일" },
  { value: "qr_code", label: "QR" },
];

export interface PosFilters {
  search: string;
  dateRange: DateRange;
  status: StatusFilterOption;
  payment: PaymentFilterOption;
}

type OpenDropdownKey = "date" | "status" | "payment";

interface PosSearchBarProps {
  filters: PosFilters;
  onChange: (filters: PosFilters) => void;
}

export default function PosSearchBar({ filters, onChange }: PosSearchBarProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdownKey | null>(null);

  function handleDropdownToggle(key: OpenDropdownKey) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function handleDropdownClose() {
    setOpenDropdown(null);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="text-monitor-text-dim pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="거래 ID, 추적 ID 검색..."
          className="border-monitor-border bg-monitor-card-bg text-monitor-text placeholder:text-monitor-text-dim focus:border-monitor-accent-blue focus:ring-monitor-accent-blue/20 h-10 w-full rounded-lg border py-2 pr-4 pl-10 text-[13px] transition-colors outline-none focus:ring-2"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DateRangePicker
          value={filters.dateRange}
          onChange={(range) => onChange({ ...filters, dateRange: range })}
          open={openDropdown === "date"}
          onToggle={() => handleDropdownToggle("date")}
          onClose={handleDropdownClose}
        />
        <FilterDropdown
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => onChange({ ...filters, status: v })}
          open={openDropdown === "status"}
          onToggle={() => handleDropdownToggle("status")}
          onClose={handleDropdownClose}
        />
        <FilterDropdown
          value={filters.payment}
          options={PAYMENT_OPTIONS}
          onChange={(v) => onChange({ ...filters, payment: v })}
          open={openDropdown === "payment"}
          onToggle={() => handleDropdownToggle("payment")}
          onClose={handleDropdownClose}
        />
      </div>
    </div>
  );
}
