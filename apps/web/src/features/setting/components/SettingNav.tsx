import { NavLink } from "react-router";
import { cn } from "@xross/core";

import UserIcon from "@/assets/icons/user.svg?react";
import BellIcon from "@/assets/icons/bell.svg?react";
import StoreIcon from "@/assets/icons/store.svg?react";
import SystemIcon from "@/assets/icons/system.svg?react";

interface NavItem {
  to: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/settings/account", label: "계정 정보", Icon: UserIcon },
  { to: "/settings/notification", label: "알림 설정", Icon: BellIcon },
  { to: "/settings/store", label: "매장 관리", Icon: StoreIcon },
  { to: "/settings/system", label: "시스템", Icon: SystemIcon },
];

export default function SettingNav() {
  return (
    <nav className="bg-monitor-bg border-monitor-border hidden h-full w-56 shrink-0 flex-col gap-1 border-r px-4 pt-4 lg:flex">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex h-[42px] w-full items-center gap-3 rounded-control pl-4 transition-colors",
              isActive
                ? "border-monitor-accent-blue/20 bg-monitor-accent-blue/10 border"
                : "border border-transparent hover:bg-white/5",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "relative size-4 shrink-0",
                  isActive
                    ? "text-monitor-accent-blue"
                    : "text-monitor-text-muted",
                )}
              >
                <Icon className="absolute block size-full max-w-none" />
              </span>
              <span
                className={cn(
                  "text-14 font-medium whitespace-nowrap",
                  isActive ? "text-monitor-accent-blue" : "text-monitor-text-muted",
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
