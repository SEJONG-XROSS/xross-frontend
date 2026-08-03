import { NavLink } from "react-router";
import { cn } from "@xross/core";
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
    <aside className="border-monitor-border bg-monitor-card-bg hidden h-screen w-[288px] shrink-0 flex-col border-r lg:flex">
      {/* 로고 영역 */}
      <div className="flex flex-col gap-2 px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-brand-primary shadow-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-white">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <span className="text-monitor-text text-lg font-bold">
            XROSS
          </span>
        </div>
        <p className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
          Unified Monitoring
        </p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-col gap-1.5 px-4 pt-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex h-11 items-center gap-3 rounded-control pl-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monitor-accent-blue",
                isActive
                  ? "bg-brand-primary shadow-button text-white"
                  : "text-monitor-text-muted hover:bg-white/5 hover:text-monitor-text",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-14 font-medium">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* 하단 시스템 상태 + 로그아웃 */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <SystemStatusCard />

        <button
          type="button"
          className="text-monitor-text-dim flex h-11 w-full items-center gap-3 rounded-control pl-4 transition-colors hover:bg-white/5 hover:text-monitor-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monitor-accent-blue"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          <span className="text-14 font-medium">
            로그아웃
          </span>
        </button>
      </div>
    </aside>
  );
}
