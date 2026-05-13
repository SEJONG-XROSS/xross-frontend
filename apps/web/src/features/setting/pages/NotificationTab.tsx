import { useState } from "react";
import SettingsSection from "@/features/setting/components/SettingsSection";
import SettingsRow from "@/features/setting/components/SettingsRow";
import ToggleSwitch from "@/features/setting/components/ToggleSwitch";

import BellIcon from "@/assets/icons/bell.svg?react";

interface NotificationState {
  mobilePush: boolean;
  sms: boolean;
  email: boolean;
  criticalOnly: boolean;
  storeSound: boolean;
  nightSilent: boolean;
}

export default function NotificationTab() {
  const [settings, setSettings] = useState<NotificationState>({
    mobilePush: true,
    sms: true,
    email: false,
    criticalOnly: false,
    storeSound: true,
    nightSilent: false,
  });

  const toggle = (key: keyof NotificationState) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSendTest = () => {
    // TODO: API 연동
    console.log("테스트 알림 발송");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 알림 채널 */}
      <SettingsSection title="알림 채널">
        <SettingsRow label="모바일 푸시 알림" description="앱 설치 필요">
          <ToggleSwitch
            checked={settings.mobilePush}
            onChange={() => toggle("mobilePush")}
          />
        </SettingsRow>
        <SettingsRow label="SMS 알림" description="010-1234-5678">
          <ToggleSwitch checked={settings.sms} onChange={() => toggle("sms")} />
        </SettingsRow>
        <SettingsRow
          label="이메일 알림"
          description="일일 요약 리포트 포함"
          hasBorder={false}
        >
          <ToggleSwitch
            checked={settings.email}
            onChange={() => toggle("email")}
          />
        </SettingsRow>
      </SettingsSection>

      {/* 알림 규칙 */}
      <SettingsSection title="알림 규칙">
        <SettingsRow
          label="Critical 이벤트만 알림"
          description="warning/info 등급 알림 차단"
        >
          <ToggleSwitch
            checked={settings.criticalOnly}
            onChange={() => toggle("criticalOnly")}
          />
        </SettingsRow>
        <SettingsRow
          label="매장 내 경고 사운드"
          description="은닉/미결제 감지 시 매장 스피커 재생"
        >
          <ToggleSwitch
            checked={settings.storeSound}
            onChange={() => toggle("storeSound")}
          />
        </SettingsRow>
        <SettingsRow
          label="야간 무음 모드"
          description="22:00 ~ 06:00 알림 음소거"
          hasBorder={false}
        >
          <ToggleSwitch
            checked={settings.nightSilent}
            onChange={() => toggle("nightSilent")}
          />
        </SettingsRow>
      </SettingsSection>

      {/* 알림 테스트 */}
      <SettingsSection title="알림 테스트">
        <div className="relative h-24 w-full shrink-0">
          <button
            type="button"
            onClick={handleSendTest}
            className="absolute top-4 left-5 flex h-10 items-center gap-2 rounded-[10px] border border-[#314158] bg-[#1d293d] px-[21px] py-[1px] transition-opacity hover:opacity-80"
          >
            <span className="relative size-4 shrink-0 text-[#cad5e2]">
              <BellIcon className="absolute block size-full max-w-none" />
            </span>
            <span className="text-[14px] leading-5 font-medium tracking-[-0.15px] text-[#cad5e2]">
              테스트 알림 발송
            </span>
          </button>
          <p className="absolute bottom-4 left-5 text-[12px] leading-4 text-[#45556c]">
            설정된 모든 채널로 테스트 알림이 발송됩니다.
          </p>
        </div>
      </SettingsSection>
    </div>
  );
}
