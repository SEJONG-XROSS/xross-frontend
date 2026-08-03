import { useNavigate } from "react-router";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import PageHeader from "@/shared/ui/PageHeader";

export default function SettingHeader() {
  const navigate = useNavigate();

  return (
    <PageHeader>
      <button
        type="button"
        onClick={() => navigate("/monitoring")}
        className="text-monitor-text-dim hover:text-monitor-text flex items-center gap-2 px-4 transition-colors sm:px-6"
      >
        <ArrowLeftIcon className="h-5 w-5 shrink-0" />
        <span className="hidden text-14 font-medium sm:inline">
          관제 화면으로 복귀
        </span>
      </button>

      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-[2px]">
        <span className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
          Settings
        </span>
        <div className="flex items-center gap-1.5">
          <SettingsIcon className="text-monitor-text h-3.5 w-3.5 shrink-0" />
          <span className="text-monitor-text text-12 font-bold sm:text-14">
            설정
          </span>
        </div>
      </div>
    </PageHeader>
  );
}
