import type {
  CameraFeed,
  DetectionEvent,
  EventDetail,
  AnalyticsDataPoint,
} from "@/features/monitoring/types/monitoring.types";

export const MOCK_CAMERAS: CameraFeed[] = [
  {
    id: "camera1",
    name: "냉동고 1구역",
    isOnline: true,
    isRecording: true,
  },
  {
    id: "camera2",
    name: "스낵/주류 코너",
    isOnline: false,
    isRecording: false,
  },
  {
    id: "camera3",
    name: "POS 셀프 계산대",
    isOnline: false,
    isRecording: false,
  },
  {
    id: "camera4",
    name: "입구/출구",
    isOnline: false,
    isRecording: false,
  },
  // {
  //   id: "cam-05",
  //   name: "음료 코너",
  //   isOnline: false,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-06",
  //   name: "계산대 1번",
  //   isOnline: true,
  //   isRecording: true,
  // },
  // {
  //   id: "cam-07",
  //   name: "계산대 2번",
  //   isOnline: true,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-08",
  //   name: "창고 입구",
  //   isOnline: false,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-09",
  //   name: "창고 입구",
  //   isOnline: false,
  //   isRecording: false,
  // },
];

export const MOCK_EVENTS: DetectionEvent[] = [
  {
    id: "evt-1042",
    title: "Pick · 미결제 퇴장",
    timestamp: "오후 07:55:05",
    severity: "critical",
    description:
      "상품 Pick 행동 및 선반 무게 감소 확인 후 POS 결제 내역 불일치.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
  },
  {
    id: "evt-1035",
    title: "은닉 · 검증 대기",
    timestamp: "오후 07:52",
    severity: "warning",
    description:
      "Pick 행동 후 가방으로 상품 이동 궤적 감지. 퇴장 시 POS 데이터 교차 검증 예정.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
  },
  {
    id: "evt-1038",
    title: "은닉 · 미결제 퇴장",
    timestamp: "오후 07:54:50",
    severity: "critical",
    description:
      "은닉 행위 감지 고객이 POS 결제 없이 퇴장. 비전 AI/무게 센서/POS 3단계 교차 검증 실패.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
  },
  {
    id: "evt-0912",
    title: "쓰러짐 · 안전 경고",
    timestamp: "오후 07:10",
    severity: "behavior",
    description: "매장 중앙 통로에서 비정상적인 자세 5초 이상 유지.",
  },
  {
    id: "evt-0840",
    title: "Put Back · 정상 반환",
    timestamp: "오후 05:55",
    severity: "info",
    description: "상품을 집었다가 다시 선반에 내려놓음 (검증 완료).",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
  },
];

export const MOCK_ANALYTICS_DATA: AnalyticsDataPoint[] = [
  { time: "08:00", picks: 12, suspicions: 0 },
  { time: "09:00", picks: 28, suspicions: 0 },
  { time: "10:00", picks: 45, suspicions: 1 },
  { time: "11:00", picks: 62, suspicions: 1 },
  { time: "12:00", picks: 88, suspicions: 1 },
  { time: "13:00", picks: 110, suspicions: 2 },
  { time: "14:00", picks: 145, suspicions: 2 },
  { time: "15:00", picks: 178, suspicions: 2 },
  { time: "16:00", picks: 210, suspicions: 3 },
  { time: "17:00", picks: 238, suspicions: 3 },
  { time: "18:00", picks: 252, suspicions: 3 },
  { time: "19:00", picks: 264, suspicions: 3 },
];

export const MOCK_ANALYTICS_STATS = [
  { label: "Pick 행동 인식", value: "264건", variant: "default" as const },
  {
    label: "미결제 의심 (불일치)",
    value: "3건",
    variant: "danger" as const,
  },
  { label: "예방된 손실액", value: "약 18,500원", variant: "success" as const },
];

const MOCK_EVENT_DETAILS: EventDetail[] = [
  {
    id: "evt-1042",
    title: "Pick · 미결제 퇴장",
    timestamp: "오후 07:55:05",
    severity: "critical",
    description:
      "상품 Pick 행동 및 선반 무게 감소 확인 후 POS 결제 내역 불일치.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
    cameraId: "camera1",
    cameraName: "냉동고 1구역 (비전+무게)",
    confidence: 96,
    showActions: true,
    verification: [
      {
        source: "vision",
        label: "비전 AI (행동 인식)",
        status: "detected",
        detail: "Pick 행동 인식 (Hand: Holding)",
      },
      {
        source: "weight",
        label: "무게 센서 (수량 파악)",
        status: "match",
        detail: "-800g 감지 (비비고 만두 2개 추정)",
      },
      {
        source: "pos",
        label: "POS 결제 로그",
        status: "mismatch",
        detail: "해당 상품 결제 로그 없음",
      },
    ],
    logEntries: [
      {
        time: "10:41:05",
        source: "vision",
        message: "ROI 접근 및 Hand State: Holding 분류",
      },
      { time: "10:41:06", source: "vision", message: "Pick 행동 패턴 인식" },
      {
        time: "10:41:06",
        source: "weight",
        message: "냉동고 1번 선반 -800g 변화 감지 (상품 2개 환산)",
      },
      {
        time: "10:42:15",
        source: "vision",
        message: "객체(고객) 출구 방향으로 이동 (Carry)",
      },
      {
        time: "10:42:30",
        source: "pos",
        message: "결제 로그 스캔 완료 (결제 내역 없음)",
        alert: "critical",
      },
      {
        time: "10:42:35",
        source: "system",
        message: "이중 검증 실패 → 점주 알림 발송",
        alert: "critical",
      },
    ],
  },
  {
    id: "evt-1035",
    title: "은닉 · 검증 대기",
    timestamp: "오후 07:52",
    severity: "warning",
    description:
      "Pick 행동 후 가방으로 상품 이동 궤적 감지. 퇴장 시 POS 데이터 교차 검증 예정.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
    cameraId: "camera1",
    cameraName: "스낵/주류 코너",
    confidence: 72,
    showActions: false,
    verification: [
      {
        source: "vision",
        label: "비전 AI (행동 인식)",
        status: "anomaly",
        detail: "가방으로 손 이동 (은닉 궤적)",
      },
      {
        source: "weight",
        label: "무게 센서 (수량 파악)",
        status: "match",
        detail: "-150g 감지 (1개 추정)",
      },
      {
        source: "pos",
        label: "POS 결제 로그",
        status: "pending",
        detail: "POS 검증 대기 중 (퇴장 시 자동 검증)",
      },
    ],
    logEntries: [
      {
        time: "10:34:10",
        source: "vision",
        message: "스낵 코너 Pick 행동 인식",
      },
      {
        time: "10:34:11",
        source: "weight",
        message: "선반 A-3 무게 -150g 감소",
      },
      {
        time: "10:34:20",
        source: "vision",
        message: "Hand State 추적 중 개인 가방으로 객체 궤적 이동",
        alert: "warning",
      },
      {
        time: "10:34:25",
        source: "system",
        message:
          "은닉 패턴 감지 → 모니터링 상태 전환 (퇴장 시 POS 교차 검증 예약)",
        alert: "warning",
      },
    ],
  },
  {
    id: "evt-1038",
    title: "은닉 · 미결제 퇴장",
    timestamp: "오후 07:54:50",
    severity: "critical",
    description:
      "은닉 행위 감지 고객이 POS 결제 없이 퇴장. 비전 AI/무게 센서/POS 3단계 교차 검증 실패.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
    cameraId: "camera1",
    cameraName: "출입구 (객체 추적)",
    confidence: 94,
    showActions: true,
    verification: [
      {
        source: "vision",
        label: "비전 AI (행동 인식)",
        status: "anomaly",
        detail: "은닉 궤적 → 출구 이동 (Carry)",
      },
      {
        source: "weight",
        label: "무게 센서 (수량 파악)",
        status: "match",
        detail: "-150g 미복구 (선반 A-3, 1개 미반환)",
      },
      {
        source: "pos",
        label: "POS 결제 로그",
        status: "mismatch",
        detail: "해당 상품 결제 로그 없음 (퇴장 시점 검증 완료)",
      },
    ],
    logEntries: [
      {
        time: "10:34:10",
        source: "vision",
        message: "스낵 코너 Pick 행동 인식",
      },
      {
        time: "10:34:11",
        source: "weight",
        message: "선반 A-3 무게 -150g 감소",
      },
      {
        time: "10:34:20",
        source: "vision",
        message: "가방으로 객체 궤적 이동 (은닉 패턴)",
      },
      {
        time: "10:34:25",
        source: "system",
        message: "은닉 패턴 감지 → 모니터링 상태 전환",
      },
      {
        time: "10:36:40",
        source: "vision",
        message: "출입구 카메라: 해당 객체(ID#247) 퇴장 감지",
      },
      {
        time: "10:36:41",
        source: "pos",
        message: "POS 결제 로그 스캔 → 해당 상품 결제 내역 없음",
        alert: "critical",
      },
      {
        time: "10:36:42",
        source: "weight",
        message: "선반 A-3 무게 미복구 확인 (-150g 유지)",
      },
      {
        time: "10:36:45",
        source: "system",
        message: "3단계 교차 검증 실패 → 절도 의심 확정 → 점주 알림 발송",
        alert: "critical",
      },
    ],
  },
  {
    id: "evt-0912",
    title: "쓰러짐 · 안전 경고",
    timestamp: "오후 07:10",
    severity: "behavior",
    description: "매장 중앙 통로에서 비정상적인 자세 5초 이상 유지.",
    cameraId: "camera1",
    cameraName: "스낵/주류 코너",
    confidence: 88,
    showActions: false,
    logEntries: [
      {
        time: "09:12:00",
        source: "vision",
        message: "객체 바운딩 박스 종횡비 급변 (쓰러짐 패턴)",
      },
      {
        time: "09:12:05",
        source: "vision",
        message: "해당 자세 5초 이상 지속됨",
      },
      {
        time: "09:12:10",
        source: "system",
        message: "안전 사고 경고 발생",
        alert: "warning",
      },
    ],
  },
  {
    id: "evt-0840",
    title: "Put Back · 정상 반환",
    timestamp: "오후 05:55",
    severity: "info",
    description: "상품을 집었다가 다시 선반에 내려놓음 (검증 완료).",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
    cameraId: "camera1",
    cameraName: "냉동고 1구역 (비전+무게)",
    confidence: 99,
    showActions: false,
    verification: [
      {
        source: "vision",
        label: "비전 AI (행동 인식)",
        status: "detected",
        detail: "Put Back 패턴 인식",
      },
      {
        source: "weight",
        label: "무게 센서 (수량 파악)",
        status: "match",
        detail: "무게 원상복구 (+200g)",
      },
      {
        source: "pos",
        label: "POS 결제 로그",
        status: "n/a",
        detail: "결제 불필요",
      },
    ],
    logEntries: [
      { time: "08:39:10", source: "vision", message: "Pick 행동 인식" },
      { time: "08:39:11", source: "weight", message: "-200g 감소" },
      {
        time: "08:40:05",
        source: "vision",
        message: "Put Back 행동 인식 (Hand State: Empty)",
      },
      {
        time: "08:40:06",
        source: "weight",
        message: "+200g 증가 (무게 복구 확인)",
      },
      {
        time: "08:40:10",
        source: "system",
        message: "정상 반환으로 이벤트 종료",
      },
    ],
  },
];

/** id로 이벤트 상세 데이터를 조회 */
export const MOCK_EVENT_DETAIL_MAP: Record<string, EventDetail> =
  Object.fromEntries(MOCK_EVENT_DETAILS.map((e) => [e.id, e]));
