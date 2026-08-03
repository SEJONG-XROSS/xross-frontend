import { NavLink } from "react-router";
import { cn } from "@xross/core";

import UserIcon from "@/assets/icons/user.svg?react";
import BellIcon from "@/assets/icons/bell.svg?react";
import StoreIcon from "@/assets/icons/store.svg?react";
import SystemIcon from "@/assets/icons/system.svg?react";

const TABS = [
  { to: "/settings/account", label: "계정", Icon: UserIcon },
  { to: "/settings/notification", label: "알림", Icon: BellIcon },
  { to: "/settings/store", label: "매장", Icon: StoreIcon },
  { to: "/settings/system", label: "시스템", Icon: SystemIcon },
];

export default function SettingMobileNav() {
  return (
    <div className="border-monitor-border bg-monitor-bg shrink-0 border-b px-3 py-2.5 lg:hidden">
      <div className="flex gap-1 rounded-control bg-white/5 p-1">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-control py-2 text-11 font-semibold transition-all",
                isActive
                  ? "bg-monitor-card-bg text-monitor-accent-blue"
                  : "text-monitor-text-dim hover:text-monitor-text-muted",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "relative size-3.5 shrink-0",
                    isActive
                      ? "text-monitor-accent-blue"
                      : "text-monitor-text-dim",
                  )}
                >
                  <Icon className="absolute block size-full max-w-none" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
