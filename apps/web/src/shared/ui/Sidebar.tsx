import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";
import { useLogout } from "@/features/auth/hooks/useLogout";

import ShieldIcon from "@/assets/icons/shield.svg?react";
import ReceiptIcon from "@/assets/icons/receipt.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import LogOutIcon from "@/assets/icons/log-out.svg?react";
import SystemStatusCard from "@/shared/ui/SystemStatusCard";

interface NavItem {
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/monitoring", icon: ShieldIcon, label: "통합 관제" },
  { to: "/pos", icon: ReceiptIcon, label: "POS 내역" },
  { to: "/settings", icon: SettingsIcon, label: "설정" },
];

export default function Sidebar() {
  const logout = useLogout();

  return (
    <aside className="border-input-border bg-surface-page hidden h-screen w-[288px] shrink-0 flex-col border-r lg:flex">
      {/* 로고 영역 */}
      <div className="flex h-[107px] flex-col gap-2 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-primary shadow-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] text-white">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <span className="text-heading text-[18px] leading-7 font-bold tracking-[0.01em]">
            XROSS
          </span>
        </div>
        <p className="text-dashboard-subtitle text-[10px] leading-[15px] tracking-[0.37px] uppercase">
          Unified Monitoring
        </p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-col gap-2 px-4 pt-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex h-11 items-center gap-3 rounded-[14px] pl-4 transition-colors",
                isActive
                  ? "bg-brand-primary shadow-button text-white"
                  : "text-dashboard-nav-inactive hover:bg-slate-100",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-[14px] leading-5 font-medium tracking-[-0.15px]">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* 하단 시스템 상태 + 로그아웃 */}
      <div className="flex flex-col gap-4 px-4 pb-4">
        <SystemStatusCard />

        <button
          type="button"
          className="text-dashboard-subtitle flex h-[46px] w-full items-center gap-3 rounded-[14px] pl-[17px] transition-colors hover:bg-slate-100"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          <span className="text-[14px] leading-5 font-medium tracking-[-0.15px]">
            로그아웃
          </span>
        </button>
      </div>
    </aside>
  );
}
