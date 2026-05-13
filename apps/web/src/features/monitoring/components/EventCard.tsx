import { useNavigate } from "react-router";
import { cn } from "@/shared/lib/utils";
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
    border: "border-[rgba(251,44,54,0.4)]",
    shadow: "shadow-[0_0_15px_rgba(239,68,68,0.05)]",
    iconBg: "bg-[#fb2c36] shadow-[0_0_10px_rgba(239,68,68,0.4)]",
    iconColor: "text-white",
    titleColor: "text-event-critical",
    Icon: ShieldAlertIcon,
  },
  warning: {
    border: "border-[rgba(254,154,0,0.4)]",
    shadow: "shadow-[0_0_15px_rgba(254,154,0,0.05)]",
    iconBg: "bg-[#fe9a00] shadow-[0_0_10px_rgba(254,154,0,0.4)]",
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
  const severity = getAlertSeverity(alert.priority);
  const { Icon: EventIcon, ...style } = SEVERITY_CONFIG[severity];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/monitoring/alerts/${alert.id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/monitoring/alerts/${alert.id}`)
      }

      className={cn(
        "bg-monitor-card-bg relative cursor-pointer rounded-[14px] border p-[14px] transition-opacity hover:opacity-80",
        alert.status === "ACKNOWLEDGED" && "opacity-50",
        style.border,
        style.shadow,
      )}
    >
      <div className="flex items-start gap-[10px]">
        <div
          className={cn(
            "mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]",
            style.iconBg,
            style.iconColor,
          )}
        >
          <EventIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col gap-[2px]">
          <span
            className={cn(
              "text-[14px] leading-5 font-bold tracking-[-0.15px]",
              style.titleColor,
            )}
          >
            {alert.title}
          </span>
          <span className="text-monitor-text-dim font-mono text-[10px] leading-[15px]">
            {formatTime(alert.createdAt)} • #{alert.id}
          </span>
        </div>
      </div>

      <p className="text-monitor-text-muted mt-[10px] pl-[38px] text-[12px] leading-[1.625]">
        {alert.message}
      </p>
    </div>
  );
}
