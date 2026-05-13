import { useNavigate } from "react-router";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";

export default function SettingHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-surface-page border-input-border relative flex h-14 w-full shrink-0 items-center border-b shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)]">
      <button
        type="button"
        onClick={() => navigate("/monitoring")}
        className="text-dashboard-subtitle hover:text-dashboard-nav-inactive flex items-center gap-2 px-4 transition-colors sm:px-6"
      >
        <ArrowLeftIcon className="h-5 w-5 shrink-0" />
        <span className="hidden text-[14px] font-medium leading-5 tracking-[0.55px] sm:inline">
          관제 화면으로 복귀
        </span>
      </button>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        <SettingsIcon className="text-dashboard-title h-4 w-4 shrink-0" />
        <span className="text-dashboard-title text-[14px] font-normal leading-5 tracking-[0.2px]">
          설정
        </span>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[rgba(43,127,255,0.5)] via-[rgba(81,162,255,0.5)] to-transparent" />
    </header>
  );
}
