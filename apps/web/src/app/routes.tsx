import { useEffect } from "react";
import { Navigate, Outlet, type RouteObject } from "react-router";
import AuthLayout from "@/shared/layouts/AuthLayout";
import RootLayout from "@/shared/layouts/RootLayout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMe } from "@/features/auth/hooks/useMe";

const ProtectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const syncStoreId = useAuthStore((s) => s.syncStoreId);
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (me) syncStoreId(me.storeId);
  }, [me, syncStoreId]);

  if (!accessToken) return <Navigate to="/auth/login" replace />;
  if (isLoading) return null;

  return <Outlet />;
};
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import MonitoringPage from "@/features/monitoring/pages/MonitoringPage";
import EventDetailPage from "@/features/monitoring/pages/EventDetailPage";
import AlertDetailPage from "@/features/monitoring/pages/AlertDetailPage";
import PosPage from "@/features/pos/pages/PosPage";
import SettingPage from "@/features/setting/pages/SettingPage";
import AccountTab from "@/features/setting/pages/AccountTab";
import NotificationTab from "@/features/setting/pages/NotificationTab";
import StoreTab from "@/features/setting/pages/StoreTab";
import SystemTab from "@/features/setting/pages/SystemTab";

export const routes: RouteObject[] = [
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        // path 없는 레이아웃 라우트: 사이드바·헤더가 필요한 모든 페이지 공유
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="/monitoring" replace /> },
          { path: "monitoring", element: <MonitoringPage /> },
          { path: "monitoring/alerts/:id", element: <AlertDetailPage /> },
          { path: "monitoring/events/:id", element: <EventDetailPage /> },
          { path: "pos", element: <PosPage /> },
          {
            path: "settings",
            element: <SettingPage />,
            children: [
              { index: true, element: <Navigate to="account" replace /> },
              { path: "account", element: <AccountTab /> },
              { path: "notification", element: <NotificationTab /> },
              { path: "store", element: <StoreTab /> },
              { path: "system", element: <SystemTab /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />, // TODO: 추후 인증 가드로 교체
  },
];
