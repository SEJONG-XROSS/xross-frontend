import KeyIcon from "@/assets/icons/key.svg?react";

interface SecuritySectionProps {
  lastPasswordChangeDays?: number;
  isOtpEnabled?: boolean;
  onChangePassword?: () => void;
}

export default function SecuritySection({
  lastPasswordChangeDays = 30,
  isOtpEnabled = true,
  onChangePassword,
}: SecuritySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-[12px] font-medium uppercase leading-4 tracking-[1.2px] text-monitor-text-dim">
        보안
      </h3>
      <div className="overflow-hidden rounded-[14px] border border-monitor-border bg-monitor-bg">
        {/* 비밀번호 변경 행 */}
        <div className="flex min-h-[70px] items-center justify-between gap-3 border-b border-monitor-border px-4 py-3 sm:px-5 lg:h-[75px] lg:py-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] leading-5 tracking-[-0.15px] text-monitor-text">
              비밀번호 변경
            </span>
            <span className="text-[12px] leading-4 text-monitor-text-dim">
              마지막 변경: {lastPasswordChangeDays}일 전
            </span>
          </div>
          <button
            type="button"
            onClick={onChangePassword}
            className="flex shrink-0 items-center gap-1 transition-opacity hover:opacity-75"
          >
            <span className="relative size-[14px] shrink-0 text-brand-primary">
              <KeyIcon className="absolute block size-full max-w-none" />
            </span>
            <span className="text-[12px] font-medium leading-4 text-brand-primary">
              변경
            </span>
          </button>
        </div>

        {/* 2단계 인증 행 */}
        <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:h-[74px] lg:py-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] leading-5 tracking-[-0.15px] text-monitor-text">
              2단계 인증 (OTP)
            </span>
            <span className="text-[12px] leading-4 text-monitor-text-dim">
              Google Authenticator 연동
            </span>
          </div>
          {isOtpEnabled && (
            <div className="flex h-[18px] shrink-0 items-center rounded-[4px] border border-[rgba(0,188,125,0.2)] bg-[rgba(0,188,125,0.1)] px-[9px] py-[3px]">
              <span className="font-mono text-[10px] leading-[15px] text-[#009966]">
                활성
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
