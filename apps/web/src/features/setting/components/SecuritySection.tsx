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
    <section className="flex flex-col gap-3">
      <h3 className="text-monitor-text-dim tracking-caps font-mono text-11 font-semibold uppercase">
        보안
      </h3>
      <div className="border-monitor-border bg-monitor-card-bg overflow-hidden rounded-card border">
        {/* 비밀번호 변경 행 */}
        <div className="border-monitor-border flex min-h-[70px] items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-monitor-text text-14">
              비밀번호 변경
            </span>
            <span className="text-monitor-text-dim text-12">
              마지막 변경: {lastPasswordChangeDays}일 전
            </span>
          </div>
          <button
            type="button"
            onClick={onChangePassword}
            className="text-monitor-accent-blue hover:bg-monitor-accent-blue/10 border-monitor-accent-blue/25 flex h-8 shrink-0 items-center gap-1.5 rounded-control border px-3 transition-colors"
          >
            <KeyIcon className="size-3.5 shrink-0" />
            <span className="text-12 font-medium">변경</span>
          </button>
        </div>

        {/* 2단계 인증 행 */}
        <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-monitor-text text-14">
              2단계 인증 (OTP)
            </span>
            <span className="text-monitor-text-dim text-12">
              Google Authenticator 연동
            </span>
          </div>
          {isOtpEnabled && (
            <div className="border-event-safe/20 bg-event-safe/10 flex shrink-0 items-center rounded-badge border px-2 py-[3px]">
              <span className="text-monitor-accent-green font-mono text-10">
                활성
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
