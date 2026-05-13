import ServerIcon from "@/assets/icons/server.svg?react";

export default function SystemStatusCard() {
  return (
    <div className="border-input-border bg-dashboard-status-card-bg flex flex-col gap-3 rounded-[14px] border px-[17px] pt-[17px] pb-[17px]">
      <div className="text-dashboard-online flex items-center gap-2">
        <ServerIcon className="h-3 w-3 shrink-0" />
        <span className="text-dashboard-subtitle font-mono text-[10px] leading-[15px] tracking-[0.5px] uppercase">
          System Status
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-dashboard-nav-inactive text-[12px] leading-4">
            Edge Nodes
          </span>
          <span className="text-dashboard-online font-mono text-[12px] leading-4">
            4/4 Online
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dashboard-nav-inactive text-[12px] leading-4">
            Sensors
          </span>
          <span className="text-dashboard-online font-mono text-[12px] leading-4">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
