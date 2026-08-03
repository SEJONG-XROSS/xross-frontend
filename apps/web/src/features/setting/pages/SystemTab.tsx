import { useState } from "react";
import SettingsSection from "@/features/setting/components/SettingsSection";
import SettingsRow from "@/features/setting/components/SettingsRow";
import ToggleSwitch from "@/features/setting/components/ToggleSwitch";

import TrashIcon from "@/assets/icons/trash.svg?react";

function InlineTag({
  label,
  variant = "blue",
}: {
  label: string;
  variant?: "blue" | "gray";
}) {
  if (variant === "blue") {
    return (
      <div className="border-monitor-accent-blue/20 bg-monitor-accent-blue/10 flex items-center rounded-badge border px-1.5 py-[3px]">
        <span className="text-monitor-accent-blue font-mono text-10">
          {label}
        </span>
      </div>
    );
  }
  return (
    <div className="bg-monitor-border flex items-center rounded-badge px-1.5 py-[3px]">
      <span className="text-monitor-text-muted font-mono text-10">
        {label}
      </span>
    </div>
  );
}

export default function SystemTab() {
  const [autoRecord, setAutoRecord] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);

  const handleResetLogs = () => {
    // TODO: API 연동 + 확인 다이얼로그
    console.log("이벤트 로그 초기화");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 탐지 엔진 */}
      <SettingsSection title="탐지 엔진">
        <SettingsRow label="비전 AI 모델" hasBorder>
          <span className="text-monitor-text font-mono text-14">
            YOLOv8-m + ByteTrack
          </span>
        </SettingsRow>
        <SettingsRow label="추론 레이턴시" hasBorder>
          <span className="text-monitor-accent-green font-mono text-14">
            14ms avg
          </span>
        </SettingsRow>
        <SettingsRow label="행동 분류" hasBorder>
          <div className="flex flex-wrap justify-end gap-1">
            {["Pick", "Put Back", "Carry", "은닉"].map((tag) => (
              <InlineTag key={tag} label={tag} variant="blue" />
            ))}
          </div>
        </SettingsRow>
        <SettingsRow label="손 상태 분류" hasBorder={false}>
          <div className="flex flex-wrap justify-end gap-1">
            {["Holding", "Empty"].map((tag) => (
              <InlineTag key={tag} label={tag} variant="gray" />
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* 녹화 / 보관 */}
      <SettingsSection title="녹화 / 보관">
        <SettingsRow
          label="이상 행동 시 자동 녹화"
          description="critical/warning 이벤트 발생 구간 자동 저장"
        >
          <ToggleSwitch checked={autoRecord} onChange={setAutoRecord} />
        </SettingsRow>
        <div className="flex min-h-[62px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:h-[68px] lg:py-0">
          <span className="text-monitor-text text-14">
            영상 보관 기간
          </span>
          <div className="border-monitor-border bg-monitor-bg focus-within:border-brand-primary/50 flex h-9 w-14 shrink-0 items-center justify-center rounded-control border transition-colors">
            <input
              type="number"
              value={retentionDays}
              min={1}
              max={365}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="text-monitor-text w-full bg-transparent text-center text-14 outline-none"
            />
          </div>
        </div>
      </SettingsSection>

      {/* 버전 정보 */}
      <SettingsSection title="버전 정보">
        <SettingsRow label="플랫폼 버전" hasBorder>
          <span className="text-monitor-text font-mono text-14">
            v2.4.1-rc3
          </span>
        </SettingsRow>
        <SettingsRow label="엣지 펌웨어" hasBorder>
          <span className="text-monitor-text font-mono text-14">
            fw-2026.03.10
          </span>
        </SettingsRow>
        <SettingsRow label="마지막 업데이트" hasBorder={false}>
          <span className="text-monitor-text text-14">
            2026-03-15 02:30 (자동)
          </span>
        </SettingsRow>
      </SettingsSection>

      {/* 위험 영역 */}
      <SettingsSection title="위험 영역">
        <div className="flex flex-col gap-2 px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={handleResetLogs}
            className="border-event-critical/20 bg-event-critical/5 text-event-critical hover:bg-event-critical/10 flex h-10 w-full items-center justify-center gap-2 rounded-control border px-5 transition-colors sm:w-auto sm:justify-start"
          >
            <span className="relative size-4 shrink-0">
              <TrashIcon className="absolute block size-full max-w-none" />
            </span>
            <span className="text-14 font-medium">
              이벤트 로그 전체 초기화
            </span>
          </button>
          <p className="text-monitor-text-dim text-12">
            모든 탐지 로그와 타임라인이 삭제됩니다. 이 작업은 되돌릴 수
            없습니다.
          </p>
        </div>
      </SettingsSection>
    </div>
  );
}
