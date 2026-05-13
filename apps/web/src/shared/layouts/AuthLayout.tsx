import { Outlet } from "react-router";
import BrandLogo from "@/shared/ui/BrandLogo";
import FeatureCard, {
  type FeatureCardProps,
} from "@/features/auth/components/FeatureCard";
import EyeIcon from "@/assets/icons/eye.svg?react";
import BalanceScaleIcon from "@/assets/icons/balance-scale.svg?react";
import DatabaseIcon from "@/assets/icons/database.svg?react";

const FEATURE_CARDS: FeatureCardProps[] = [
  {
    icon: <EyeIcon className="text-feature-icon size-4" />,
    title: "엣지 비전 AI",
    description: "실시간 영상 분석으로 이상 상황을 빠르게 포착합니다.",
  },
  {
    icon: <BalanceScaleIcon className="text-feature-icon size-4" />,
    title: "무게 센서",
    description: "상품 변화 데이터를 정밀하게 감지해 신뢰도 강화합니다.",
  },
  {
    icon: <DatabaseIcon className="text-feature-icon size-4" />,
    title: "POS 연동",
    description: "결제 이력과 현장 데이터를 자동으로 대조 검증합니다.",
  },
];

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full">
      {/* 좌측 브랜딩 패널 — 태블릿 이하 숨김 */}
      <aside
        className="border-sidebar-border relative hidden w-[540px] shrink-0 flex-col justify-between border-r p-10 lg:flex"
        style={{ backgroundImage: "var(--xross-gradient-login-sidebar)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" />

        {/* 로고 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="text-sidebar-text text-xl leading-7">XROSS</span>
          </div>
          <p className="text-sidebar-subtitle text-sm leading-5 tracking-wide">
            무인점포 실시간 관제 플랫폼
          </p>
        </div>

        {/* 헤딩 + 피처 카드 */}
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-medium">
            <p className="text-sidebar-text leading-8">
              비전 AI + 무게 센서 + POS
            </p>
            <p className="leading-8">
              <span className="text-brand-accent">3단계 교차 검증</span>
              <span className="text-sidebar-text">으로</span>
            </p>
            <p className="text-sidebar-text leading-8">매장을 안전하게.</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* 카피라이트 */}
        <p className="text-sidebar-footnote text-[11px] leading-4 tracking-wider">
          © 2026 XROSS Systems. All rights reserved.
        </p>
      </aside>

      {/* 우측 콘텐츠 영역 */}
      <main className="bg-surface-page flex flex-1 items-center justify-center px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
