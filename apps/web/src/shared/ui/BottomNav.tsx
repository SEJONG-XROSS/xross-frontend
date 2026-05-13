import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";

import ShieldIcon from "@/assets/icons/shield.svg?react";
import ReceiptIcon from "@/assets/icons/receipt.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";

interface NavItem {
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/monitoring", icon: ShieldIcon, label: "관제" },
  { to: "/pos", icon: ReceiptIcon, label: "POS" },
  { to: "/settings", icon: SettingsIcon, label: "설정" },
];

export default function BottomNav() {
  return (
    <nav className="border-input-border bg-surface-page flex shrink-0 border-t lg:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
              isActive
                ? "text-brand-primary"
                : "text-dashboard-nav-inactive",
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="bg-brand-primary absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] leading-3 tracking-[0.2px]",
                  isActive ? "font-bold" : "font-medium",
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
