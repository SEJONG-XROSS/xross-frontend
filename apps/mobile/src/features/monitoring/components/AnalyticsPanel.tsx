import React, { useState, useMemo } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "@xross/tokens";
import type { EventResponse } from "@xross/core";

interface Stat {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
}

interface Props {
  behaviorStats: Stat[];
  paymentStats: Stat[];
  chartData: {
    time: string;
    picks: number;
    suspicions: number;
    enters: number;
    payments: number;
  }[];
  date: string;
  onOpenEventLog?: () => void;
}

const STAT_COLOR = {
  default: colors.monitor.text,
  danger: colors.event.critical,
  success: colors.monitor["accent-green"],
};

type ChartMode = "hourly" | "cumulative";
type ChartTab = "behavior" | "payment";

const CHART_TABS: { key: ChartTab; label: string; color: string }[] = [
  { key: "behavior", label: "Pick 행동",  color: colors.monitor["accent-blue"] },
  { key: "payment",  label: "입장·결제",  color: colors.monitor["accent-purple"] },
];

function toCumulative(data: Props["chartData"]): Props["chartData"] {
  let picks = 0, suspicions = 0, enters = 0, payments = 0;
  return data.map((d) => {
    picks += d.picks;
    suspicions += d.suspicions;
    enters += d.enters;
    payments += d.payments;
    return { ...d, picks, suspicions, enters, payments };
  });
}

function formatDate(dateStr: string): string {
  const today = new Date().toLocaleDateString("en-CA");
  if (dateStr === today) return "금일";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <View className="flex-row">
      {stats.map((stat, i) => (
        <View
          key={stat.label}
          className="pr-3"
          style={{
            paddingLeft: i > 0 ? 12 : 0,
            borderLeftWidth: i > 0 ? 1 : 0,
            borderLeftColor: colors.monitor["border-strong"],
          }}
        >
          <Text className="text-10 text-monitor-text-dim" style={{ fontFamily: "monospace" }}>
            {stat.label}
          </Text>
          <Text
            className="text-14 font-bold"
            style={{ color: STAT_COLOR[stat.variant ?? "default"], fontFamily: "monospace" }}
          >
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ChartSection({
  label,
  stats,
  data1,
  data2,
  color1,
  color2,
  fill1,
  fill2,
  chartWidth,
  spacing,
  mode,
  tooltipKey1,
  tooltipKey2,
}: {
  label: string;
  stats: Stat[];
  data1: { value: number; label?: string; dataHour?: number }[];
  data2: { value: number }[];
  color1: string;
  color2: string;
  fill1: string;
  fill2: string;
  chartWidth: number;
  spacing: number;
  mode: ChartMode;
  tooltipKey1: string;
  tooltipKey2: string;
}) {
  const totalPoints = data1.length;
  return (
    <View className="mb-1">
      {/* 라벨 + 통계 */}
      <View className="flex-row items-end justify-between mb-1.5">
        <Text className="text-10 font-bold text-monitor-text-dim tracking-caps uppercase">
          {label}
        </Text>
        <StatRow stats={stats} />
      </View>

      {/* 차트 */}
      {data1.length > 0 && (
        <View className="-ml-2">
          <LineChart
            data={data1}
            data2={data2}
            width={chartWidth}
            height={100}
            spacing={spacing}
            color1={color1}
            color2={color2}
            thickness1={2}
            thickness2={1.5}
            startFillColor1={fill1}
            endFillColor1="rgba(0,0,0,0)"
            startFillColor2={fill2}
            endFillColor2="rgba(0,0,0,0)"
            areaChart
            curved
            hideDataPoints
            hideRules
            hideYAxisText
            xAxisColor={colors.monitor.border}
            xAxisThickness={1}
            backgroundColor="transparent"
            noOfSections={3}
            xAxisLabelTextStyle={{ color: colors.monitor["text-dim"], fontSize: 8 }}
            showXAxisIndices={false}
            pointerConfig={{
              pointerStripHeight: 70,
              pointerStripColor: colors.monitor["border-strong"],
              pointerStripWidth: 1,
              pointerColor: color1,
              radius: 4,
              pointerLabelWidth: 80,
              pointerLabelHeight: 44,
              activatePointersOnLongPress: false,
              pointerLabelComponent: (items: { value: number; dataHour?: number }[]) => {
                const hour = items[0]?.dataHour ?? 0;
                const isRightSide = (hour as number) >= totalPoints * 0.65;
                const marginLeft = isRightSide ? -60 : 0;
                return (
                  <View
                    className="bg-monitor-card-bg rounded-badge border border-monitor-border-strong p-1.5 gap-0.5 w-20"
                    style={{ marginLeft }}
                  >
                    <Text className="text-10 text-monitor-text-dim mb-0.5">
                      {mode === "cumulative" ? `~${hour}시 누적` : `${hour}시`}
                    </Text>
                    <Text className="text-10 font-bold" style={{ color: color1 }}>
                      {tooltipKey1} {items[0]?.value ?? 0}
                    </Text>
                    <Text className="text-10" style={{ color: color2 }}>
                      {tooltipKey2} {items[1]?.value ?? 0}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
      )}
    </View>
  );
}

export function AnalyticsPanel({ behaviorStats, paymentStats, chartData, date, onOpenEventLog }: Props) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;
  const [mode, setMode] = useState<ChartMode>("hourly");
  const [chartTab, setChartTab] = useState<ChartTab>("behavior");

  const displayData = mode === "cumulative" ? toCumulative(chartData) : chartData;
  const spacing = Math.min(20, chartWidth / Math.max(displayData.length, 1));

  const behaviorData1 = displayData.map((d, i) => ({
    value: d.picks,
    label: i % 2 === 0 ? `${i}h` : "",
    dataHour: i,
  }));
  const behaviorData2 = displayData.map((d) => ({ value: d.suspicions }));

  const paymentData1 = displayData.map((d, i) => ({
    value: d.enters,
    label: i % 2 === 0 ? `${i}h` : "",
    dataHour: i,
  }));
  const paymentData2 = displayData.map((d) => ({ value: d.payments }));

  return (
    <View className="bg-monitor-bg border-t border-monitor-border px-4 pt-3 pb-4">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-10 font-bold text-monitor-text-muted tracking-caps uppercase">
          매장 행동 분석 통계{" "}
          <Text className="text-monitor-text-dim tracking-normal">({formatDate(date)})</Text>
        </Text>

        <View className="flex-row items-center gap-1.5">
          {onOpenEventLog && (
            <Pressable
              onPress={onOpenEventLog}
              className="border border-monitor-border rounded-badge px-2 py-1 bg-monitor-bg"
            >
              <Text className="text-10 font-semibold text-monitor-text-dim">이벤트 로그</Text>
            </Pressable>
          )}
          <View className="flex-row border border-monitor-border rounded-badge bg-monitor-bg p-0.5">
            {(["hourly", "cumulative"] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                className={`px-2 py-[3px] rounded ${mode === m ? "bg-monitor-accent-blue" : "bg-transparent"}`}
              >
                <Text className={`text-10 font-bold ${mode === m ? "text-white" : "text-monitor-text-dim"}`}>
                  {m === "hourly" ? "시간대별" : "누적"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* 차트 탭 */}
      <View className="flex-row bg-white/5 rounded-control p-[3px] mb-3.5">
        {CHART_TABS.map(({ key, label, color }) => {
          const active = chartTab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setChartTab(key)}
              className={`flex-1 items-center py-[7px] rounded-[7px] ${active ? "bg-monitor-bg" : "bg-transparent"}`}
            >
              <Text
                className="text-11 font-bold"
                style={{ color: active ? color : colors.monitor["text-dim"] }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 차트 */}
      {chartTab === "behavior" ? (
        <ChartSection
          label="Pick 행동 · 미결제 의심"
          stats={behaviorStats}
          data1={behaviorData1}
          data2={behaviorData2}
          color1={colors.monitor["accent-blue"]}
          color2={colors.event.critical}
          fill1="rgba(81,162,255,0.2)"
          fill2="rgba(255,100,103,0.15)"
          chartWidth={chartWidth}
          spacing={spacing}
          mode={mode}
          tooltipKey1="집기"
          tooltipKey2="의심"
        />
      ) : (
        <ChartSection
          label="총 입장 · 결제 완료"
          stats={paymentStats}
          data1={paymentData1}
          data2={paymentData2}
          color1={colors.monitor["accent-purple"]}
          color2={colors.monitor["accent-green"]}
          fill1="rgba(194,122,255,0.2)"
          fill2="rgba(0,212,146,0.15)"
          chartWidth={chartWidth}
          spacing={spacing}
          mode={mode}
          tooltipKey1="입장"
          tooltipKey2="결제"
        />
      )}
    </View>
  );
}

export function buildStats(events: EventResponse[]) {
  const behaviorStats: { label: string; value: string; variant?: "default" | "danger" | "success" }[] = [
    { label: "상품 집기", value: String(events.filter((e) => e.type === "PICK").length) },
    { label: "미결제 의심", value: String(events.filter((e) => e.type === "UNPAID_SUSPICIOUS").length), variant: "danger" },
  ];
  const paymentStats: { label: string; value: string; variant?: "default" | "danger" | "success" }[] = [
    { label: "총 입장", value: String(events.filter((e) => e.type === "ENTER").length) },
    { label: "결제 완료", value: String(events.filter((e) => e.type === "PAYMENT_MATCHED").length), variant: "success" },
  ];
  return { behaviorStats, paymentStats };
}

export function buildChartData(events: EventResponse[], date: string) {
  const now = new Date();
  const isToday = date === new Date().toLocaleDateString("en-CA");
  const maxHour = isToday ? now.getHours() : 23;

  return Array.from({ length: maxHour + 1 }, (_, h) => {
    const base = new Date(`${date}T00:00:00`);
    const hour = new Date(base);
    hour.setHours(h);
    const nextHour = new Date(hour);
    nextHour.setHours(h + 1);

    const inRange = events.filter((e) => {
      const t = new Date(e.occurredAt).getTime();
      return t >= hour.getTime() && t < nextHour.getTime();
    });

    return {
      time: `${h}시`,
      picks: inRange.filter((e) => e.type === "PICK").length,
      suspicions: inRange.filter((e) => e.type === "UNPAID_SUSPICIOUS").length,
      enters: inRange.filter((e) => e.type === "ENTER").length,
      payments: inRange.filter((e) => e.type === "PAYMENT_MATCHED").length,
    };
  });
}
