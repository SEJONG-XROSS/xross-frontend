import { Link } from "react-router";
import BrandLogo from "@/shared/ui/BrandLogo";

function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-96 flex-col items-center text-center lg:items-start lg:text-left">
      <div className="mb-6 flex size-[60px] items-center justify-center rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:hidden">
        <BrandLogo className="size-11 shrink-0" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-heading text-2xl leading-8 font-bold tracking-tight">
          비밀번호 찾기
        </h1>
        <p className="text-body text-sm leading-6 tracking-tight">
          보안 정책상 비밀번호 재설정은 관리자를 통해 진행됩니다.
          <br />
          매장 담당 관리자 또는 XROSS 지원팀에 문의해 주세요.
        </p>
      </div>

      <div className="mt-6 w-full rounded-control bg-surface-page px-5 py-4 text-left ring-1 ring-input-border">
        <p className="text-label text-xs font-medium tracking-wider uppercase">
          지원팀 연락처
        </p>
        <p className="text-heading mt-1.5 text-sm font-semibold">
          support@xross.io
        </p>
      </div>

      <Link
        to="/auth/login"
        className="text-link hover:text-link-hover mt-6 text-sm font-medium"
      >
        ← 로그인으로 돌아가기
      </Link>
    </div>
  );
}

export default ForgotPasswordPage;
