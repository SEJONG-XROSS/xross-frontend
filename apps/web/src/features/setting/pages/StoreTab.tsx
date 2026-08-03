import SettingsSection from "@/features/setting/components/SettingsSection";
import SettingsRow from "@/features/setting/components/SettingsRow";
import { useMe } from "@/features/auth/hooks/useMe";

import CameraIcon from "@/assets/icons/camera.svg?react";
import BalanceScaleIcon from "@/assets/icons/balance-scale.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";

interface CameraNode {
  name: string;
  edgeNode: string;
  camId: string;
  hasSensorBadge?: boolean;
}

const CAMERA_NODES: CameraNode[] = [
  {
    name: "냉동고 1구역",
    edgeNode: "Edge-TX2-01",
    camId: "cam-01",
    hasSensorBadge: true,
  },
  { name: "스낵/주류 코너", edgeNode: "Edge-TX2-02", camId: "cam-02" },
  { name: "POS 셀프 계산대", edgeNode: "Edge-Nano-01", camId: "cam-03" },
  { name: "출입구", edgeNode: "Edge-Nano-02", camId: "cam-04" },
];

function CameraRow({
  name,
  edgeNode,
  camId,
  hasSensorBadge,
  hasBorder,
}: CameraNode & { hasBorder: boolean }) {
  return (
    <div
      className={`flex min-h-[65px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:h-[71.5px] lg:py-0 ${hasBorder ? "border-monitor-border border-b" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-monitor-accent-blue relative size-4 shrink-0">
          <CameraIcon className="absolute block size-full max-w-none" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-monitor-text text-14">
            {name}
          </span>
          <span className="text-monitor-text-dim font-mono text-11">
            {edgeNode} · {camId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasSensorBadge && (
          <div className="border-event-safe/20 bg-event-safe/10 flex items-center gap-1 rounded-badge border px-1.5 py-[3px]">
            <span className="text-monitor-accent-green relative size-3 shrink-0">
              <BalanceScaleIcon className="absolute block size-full max-w-none" />
            </span>
            <span className="text-monitor-accent-green font-mono text-10">
              센서
            </span>
          </div>
        )}
        <div className="shadow-status bg-event-safe size-2 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

export default function StoreTab() {
  const { data: me } = useMe();

  return (
    <div className="flex flex-col gap-8">
      {/* 매장 기본 정보 */}
      <SettingsSection title="매장 기본 정보">
        <SettingsRow label="매장 ID" hasBorder>
          <span className="text-monitor-text font-mono text-14">
            {me ? String(me.storeId) : "—"}
          </span>
        </SettingsRow>
        <SettingsRow label="매장명" hasBorder>
          <span className="text-monitor-text text-14">
            {me?.storeName ?? "—"}
          </span>
        </SettingsRow>
        <SettingsRow label="운영 시간" hasBorder>
          <span className="text-monitor-text text-14">
            24시간 무인 운영
          </span>
        </SettingsRow>
        {/* 주소 row - 2줄 타입 */}
        <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:h-[74px] lg:py-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-monitor-text text-14">
              주소
            </span>
            <span className="text-monitor-text-dim text-12">
              서울 강남구 테헤란로 123
            </span>
          </div>
          <span className="text-monitor-text-dim relative size-4 shrink-0">
            <ChevronRightIcon className="absolute block size-full max-w-none" />
          </span>
        </div>
      </SettingsSection>

      {/* 카메라 / 엣지 노드 현황 */}
      <SettingsSection title="카메라 / 엣지 노드 현황">
        {CAMERA_NODES.map((cam, idx) => (
          <CameraRow
            key={cam.camId}
            {...cam}
            hasBorder={idx < CAMERA_NODES.length - 1}
          />
        ))}
      </SettingsSection>

      {/* POS 연동 */}
      <SettingsSection title="POS 연동">
        <SettingsRow label="POS 시스템" description="KIS 무인 결제 v3.2">
          <div className="border-event-safe/20 bg-event-safe/10 flex items-center rounded-badge border px-2 py-[3px]">
            <span className="text-monitor-accent-green font-mono text-10">
              동기화됨
            </span>
          </div>
        </SettingsRow>
        <SettingsRow
          label="결제 검증 모드"
          description="퇴장 시점 자동 교차 검증"
          hasBorder={false}
        >
          <span className="text-monitor-text font-mono text-14">
            EXIT_TRIGGER
          </span>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
