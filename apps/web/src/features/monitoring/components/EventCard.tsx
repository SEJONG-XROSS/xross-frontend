import { useLocation, useNavigate } from "react-router";
import { cn } from "@xross/core";
import type { AlertResponse } from "@/features/monitoring/api/monitoring.types";
import { getAlertSeverity } from "@/features/monitoring/lib/mappers";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import EventInfoIcon from "@/assets/icons/event-info.svg?react";

type CardSeverity = "critical" | "warning" | "info";

const SEVERITY_CONFIG: Record<
  CardSeverity,
  {
    border: string;
    shadow: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  critical: {
    border: "border-event-critical/40",
    shadow: "shadow-glow-critical",
    iconBg: "bg-event-critical shadow-icon-critical",
    iconColor: "text-white",
    titleColor: "text-event-critical",
    Icon: ShieldAlertIcon,
  },
  warning: {
    border: "border-event-warning/40",
    shadow: "shadow-glow-warning",
    iconBg: "bg-event-warning shadow-icon-warning",
    iconColor: "text-white",
    titleColor: "text-event-warning",
    Icon: TriangleAlertIcon,
  },
  info: {
    border: "border-monitor-border",
    shadow: "",
    iconBg: "bg-monitor-border",
    iconColor: "text-monitor-text-muted",
    titleColor: "text-monitor-text-muted",
    Icon: EventInfoIcon,
  },
};


function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface EventCardProps {
  alert: AlertResponse;
}

export default function EventCard({ alert }: EventCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const severity = getAlertSeverity(alert.priority);
  const { Icon: EventIcon, ...style } = SEVERITY_CONFIG[severity];
  const goDetail = () =>
    navigate({
      pathname: `/monitoring/alerts/${alert.id}`,
      search: location.search,
    });
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => e.key === "Enter" && goDetail()}

      className={cn(
        "bg-monitor-card-bg relative cursor-pointer rounded-card border p-3.5 transition-opacity hover:opacity-80",
        alert.status === "ACKNOWLEDGED" && "opacity-50",
        style.border,
        style.shadow,
      )}
    >
      <div className="flex items-start gap-[10px]">
        <div
          className={cn(
            "mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-control",
            style.iconBg,
            style.iconColor,
          )}
        >
          <EventIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col gap-[2px]">
          <span
            className={cn(
              "text-14 font-bold",
              style.titleColor,
            )}
          >
            {alert.title}
          </span>
          <span className="text-monitor-text-dim font-mono text-10">
            {formatTime(alert.createdAt)} • #{alert.id}
          </span>
        </div>
      </div>

      <p className="text-monitor-text-muted mt-[10px] pl-[38px] text-12">
        {alert.message}
      </p>
    </div>
  );
}
