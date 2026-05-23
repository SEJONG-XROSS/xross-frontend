import React, { useState, useMemo } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
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
  default: "#e2e8f0",
  danger: "#ff6467",
  success: "#00d492",
};

type ChartMode = "hourly" | "cumulative";
type ChartTab = "behavior" | "payment";

const CHART_TABS: { key: ChartTab; label: string; color: string }[] = [
  { key: "behavior", label: "Pick 행동",  color: "#51a2ff" },
  { key: "payment",  label: "입장·결제",  color: "#8b5cf6" },
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
    <View style={{ flexDirection: "row", gap: 0 }}>
      {stats.map((stat, i) => (
        <View
          key={stat.label}
          style={{
            paddingLeft: i > 0 ? 12 : 0,
            paddingRight: 12,
            borderLeftWidth: i > 0 ? 1 : 0,
            borderLeftColor: "#314158",
          }}
        >
          <Text style={{ fontSize: 10, color: "#62748e", fontFamily: "monospace" }}>
            {stat.label}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: STAT_COLOR[stat.variant ?? "default"], fontFamily: "monospace" }}>
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
    <View style={{ marginBottom: 4 }}>
      {/* 라벨 + 통계 */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ fontSize: 9, fontWeight: "700", color: "#62748e", letterSpacing: 1, textTransform: "uppercase" }}>
          {label}
        </Text>
        <StatRow stats={stats} />
      </View>

      {/* 차트 */}
      {data1.length > 0 && (
        <View style={{ marginLeft: -8 }}>
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
            xAxisColor="#1d293d"
            xAxisThickness={1}
            backgroundColor="transparent"
            noOfSections={3}
            xAxisLabelTextStyle={{ color: "#62748e", fontSize: 8 }}
            showXAxisIndices={false}
            pointerConfig={{
              pointerStripHeight: 70,
              pointerStripColor: "#314158",
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
                  <View style={{ marginLeft, backgroundColor: "#020618", borderRadius: 6, borderWidth: 1, borderColor: "#314158", padding: 6, gap: 2, width: 80 }}>
                    <Text style={{ color: "#62748e", fontSize: 9, marginBottom: 2 }}>
                      {mode === "cumulative" ? `~${hour}시 누적` : `${hour}시`}
                    </Text>
                    <Text style={{ color: color1, fontSize: 10, fontWeight: "700" }}>
                      {tooltipKey1} {items[0]?.value ?? 0}
                    </Text>
                    <Text style={{ color: color2, fontSize: 10 }}>
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
    <View style={{ backgroundColor: "#0f172b", borderTopWidth: 1, borderTopColor: "#1d293d", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
      {/* 헤더 */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: "700", color: "#90a1b9", letterSpacing: 1.2, textTransform: "uppercase" }}>
          매장 행동 분석 통계{" "}
          <Text style={{ color: "#62748e", letterSpacing: 0 }}>({formatDate(date)})</Text>
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {onOpenEventLog && (
            <Pressable
              onPress={onOpenEventLog}
              style={{ borderWidth: 1, borderColor: "#1d293d", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#0d1b2e" }}
            >
              <Text style={{ fontSize: 10, fontWeight: "600", color: "#62748e" }}>이벤트 로그</Text>
            </Pressable>
          )}
          <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#1d293d", borderRadius: 6, backgroundColor: "#0d1b2e", padding: 2 }}>
            {(["hourly", "cumulative"] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: mode === m ? "#51a2ff" : "transparent" }}
              >
                <Text style={{ fontSize: 9, fontWeight: "700", color: mode === m ? "#fff" : "#62748e" }}>
                  {m === "hourly" ? "시간대별" : "누적"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* 차트 탭 */}
      <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3, marginBottom: 14 }}>
        {CHART_TABS.map(({ key, label, color }) => {
          const active = chartTab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setChartTab(key)}
              style={{ flex: 1, alignItems: "center", paddingVertical: 7, borderRadius: 7, backgroundColor: active ? "#0d1b2e" : "transparent" }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: active ? color : "#62748e" }}>
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
          color1="#51a2ff"
          color2="#ff6467"
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
          color1="#8b5cf6"
          color2="#00d492"
          fill1="rgba(139,92,246,0.2)"
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
