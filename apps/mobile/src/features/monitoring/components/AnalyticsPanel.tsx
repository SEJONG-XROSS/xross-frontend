import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import type { EventResponse, AlertResponse } from "@xross/core";

interface Stat {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
}

interface Props {
  stats: Stat[];
  chartData: { time: string; picks: number; suspicions: number }[];
}

const STAT_COLOR = {
  default: "#e2e8f0",
  danger: "#ff6467",
  success: "#00d492",
};

export function AnalyticsPanel({ stats, chartData }: Props) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;
  // 포인트당 간격 — 최대 20px 로 제한해 데이터가 적을 때 과도하게 벌어지지 않게
  const spacing = Math.min(20, chartWidth / Math.max(chartData.length, 1));

  // x라벨 — 2시간 고정 간격, dataHour는 툴팁에서 사용
  const picksData = chartData.map((d, i) => ({
    value: d.picks,
    label: i % 2 === 0 ? `${i}h` : "",
    dataHour: i,
  }));
  const suspData = chartData.map((d) => ({ value: d.suspicions }));

  return (
    <View
      style={{
        backgroundColor: "#0f172b",
        borderTopWidth: 1,
        borderTopColor: "#1d293d",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
      }}
    >
      {/* 헤더 + 통계 */}
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          color: "#90a1b9",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        매장 행동 분석 통계
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {stats.map((stat, i) => (
          <View
            key={stat.label}
            style={{
              flex: 1,
              paddingLeft: i > 0 ? 16 : 0,
              paddingRight: 12,
              borderLeftWidth: i > 0 ? 1 : 0,
              borderLeftColor: "#314158",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: "#62748e",
                fontFamily: "monospace",
              }}
            >
              {stat.label}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: STAT_COLOR[stat.variant ?? "default"],
                fontFamily: "monospace",
              }}
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      {/* 차트 */}
      {chartData.length > 0 && (
        <View style={{ marginLeft: -8 }}>
          <LineChart
            data={picksData}
            data2={suspData}
            width={chartWidth}
            height={120}
            spacing={spacing}
            color1="#51a2ff"
            color2="#ff6467"
            thickness1={2}
            thickness2={1.5}
            startFillColor1="rgba(81,162,255,0.2)"
            endFillColor1="rgba(81,162,255,0)"
            startFillColor2="rgba(255,100,103,0.15)"
            endFillColor2="rgba(255,100,103,0)"
            areaChart
            curved
            hideDataPoints
            hideRules
            hideYAxisText
            xAxisColor="#1d293d"
            xAxisThickness={1}
            backgroundColor="transparent"
            noOfSections={3}
            yAxisTextStyle={{ color: "#62748e", fontSize: 9 }}
            xAxisLabelTextStyle={{ color: "#62748e", fontSize: 8 }}
            showXAxisIndices={false}
            pointerConfig={{
              pointerStripHeight: 80,
              pointerStripColor: "#314158",
              pointerStripWidth: 1,
              pointerColor: "#51a2ff",
              radius: 4,
              pointerLabelWidth: 80,
              pointerLabelHeight: 40,
              activatePointersOnLongPress: false,
              pointerLabelComponent: (
                items: { value: number; dataHour?: number }[],
              ) => {
                const hour = items[0]?.dataHour ?? 0;
                const total = chartData.length;
                const TOOLTIP_WIDTH = 72;
                // 스트립 기준 중앙 정렬 (기본)
                // 오른쪽 끝 구간은 스트립 오른쪽에 툴팁이 붙도록 오프셋
                const isRightSide = (hour as number) >= total * 0.65;
                // 스트립과 툴팁이 항상 연결되도록:
                // - 기본: 스트립이 툴팁 왼쪽 가장자리에 닿게 (marginLeft: 0)
                // - 오른쪽: 스트립이 툴팁 오른쪽 가장자리에 닿게 (marginLeft: -TOOLTIP_WIDTH)
                const marginLeft = isRightSide ? -TOOLTIP_WIDTH + 20 : 0;
                return (
                  <View
                    style={{
                      marginLeft,
                      backgroundColor: "#020618",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#314158",
                      padding: 6,
                      gap: 2,
                      width: TOOLTIP_WIDTH,
                    }}
                  >
                    <Text
                      style={{ color: "#62748e", fontSize: 9, marginBottom: 2 }}
                    >
                      {hour}시
                    </Text>
                    <Text
                      style={{
                        color: "#51a2ff",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      집기 {items[0]?.value ?? 0}
                    </Text>
                    <Text style={{ color: "#ff6467", fontSize: 10 }}>
                      의심 {items[1]?.value ?? 0}
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

export function buildStats(
  events: EventResponse[],
  alerts: AlertResponse[],
): Stat[] {
  return [
    {
      label: "총 입장",
      value: String(events.filter((e) => e.type === "ENTER").length),
    },
    {
      label: "상품 집기",
      value: String(events.filter((e) => e.type === "PICK").length),
    },
    { label: "이상 감지", value: String(alerts.length), variant: "danger" },
    {
      label: "결제 완료",
      value: String(events.filter((e) => e.type === "PAYMENT_RECEIVED").length),
      variant: "success",
    },
  ];
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
      suspicions: inRange.filter(
        (e) => e.type === "UNPAID_SUSPICIOUS" || e.type === "PAYMENT_MISMATCH",
      ).length,
    };
  });
}
