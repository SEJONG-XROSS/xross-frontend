import { Outlet } from "react-router";
import Sidebar from "@/shared/ui/Sidebar";
import BottomNav from "@/shared/ui/BottomNav";

export default function RootLayout() {
  return (
    <div className="bg-surface-page flex h-screen w-screen flex-col overflow-hidden lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
