import ServerIcon from "@/assets/icons/server.svg?react";

export default function SystemStatusCard() {
  return (
    <div className="border-monitor-border flex flex-col gap-3 rounded-card border bg-white/5 p-4">
      <div className="text-monitor-accent-green flex items-center gap-2">
        <ServerIcon className="h-3 w-3 shrink-0" />
        <span className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
          System Status
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-monitor-text-muted text-12">
            Edge Nodes
          </span>
          <span className="text-monitor-accent-green font-mono text-12">
            4/4 Online
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-monitor-text-muted text-12">
            Sensors
          </span>
          <span className="text-monitor-accent-green font-mono text-12">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
