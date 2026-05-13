import { useState } from "react";
import Input from "@/shared/ui/Input";
import { useNavigate } from "react-router";
import BrandLogo from "@/shared/ui/BrandLogo";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      { email, password },
      { onSuccess: () => navigate("/monitoring") },
    );
  };

  return (
    <div className="flex w-full max-w-96 flex-col">
      {/* 모바일: 브랜딩 영역 · PC는 AuthLayout 좌측 패널 사용 */}
      <div className="mb-4 flex flex-col items-center lg:hidden">
        {/* 로고 & 타이틀 */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-[60px] items-center justify-center rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            <BrandLogo className="size-11 shrink-0" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-heading text-[22px] font-bold tracking-tight">
              XROSS
            </h2>
            <p className="text-body text-[14px] font-medium tracking-wide">
              무인점포 실시간 관제 플랫폼
            </p>
          </div>
        </div>

        {/* 핵심 가치 하이라이트 박스 */}
        <div className="flex w-full flex-col items-center gap-1.5 rounded-2xl bg-slate-50 px-5 py-4 text-center ring-1 ring-slate-200">
          <p className="text-heading text-[15px] font-bold tracking-tight">
            비전 AI <span className="text-muted mx-1.5 font-light">|</span> 무게
            센서 <span className="text-muted mx-1.5 font-light">|</span> POS
          </p>
          <p className="text-body text-[13px] leading-relaxed tracking-tight">
            <span className="text-brand-primary font-semibold">
              3단계 교차 검증
            </span>
            으로 매장을 안전하게.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:mt-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading text-2xl leading-8 font-medium tracking-tight">
            관제 로그인
          </h1>
          <p className="text-body text-sm leading-5 tracking-tight">
            등록된 매장 관리자 계정으로 로그인하세요.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="이메일"
            type="email"
            placeholder="admin@store.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 로그인 유지 + 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="border-checkbox-border accent-brand-primary size-4 rounded"
              />
              <span className="text-label text-xs font-medium">
                로그인 유지
              </span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-link hover:text-link-hover text-xs font-medium"
            >
              비밀번호 찾기
            </a>
          </div>

          {mutation.isError && (
            <p className="text-event-critical text-sm">
              {mutation.error?.message ?? "로그인에 실패했습니다."}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-brand-primary text-brand-on-primary shadow-button hover:bg-brand-primary-hover active:bg-brand-primary-active h-11 rounded-[10px] text-sm font-medium transition-colors disabled:opacity-60"
          >
            {mutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
