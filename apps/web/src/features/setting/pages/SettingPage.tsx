import { Outlet } from "react-router";
import SettingHeader from "@/features/setting/components/SettingHeader";
import SettingNav from "@/features/setting/components/SettingNav";
import SettingMobileNav from "@/features/setting/components/SettingMobileNav";

export default function SettingPage() {
  return (
    <>
      <SettingHeader />
      <SettingMobileNav />

      <div className="flex flex-1 overflow-hidden">
        <SettingNav />

        <main className="bg-monitor-card-bg flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[672px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
