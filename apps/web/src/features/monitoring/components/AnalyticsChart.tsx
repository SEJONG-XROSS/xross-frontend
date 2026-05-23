import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { AnalyticsDataPoint } from "@/features/monitoring/types/monitoring.types";

interface AnalyticsChartProps {
  data: AnalyticsDataPoint[];
  height: number;
  variant?: "behavior" | "payment";
}

function formatTick(value: string): string {
  return value.replace(":00", "시");
}

const SERIES = {
  behavior: [
    { dataKey: "picks",      name: "Pick 행동",   color: "#3B82F6", gradientId: "pickGradient" },
    { dataKey: "suspicions", name: "미결제 의심",  color: "#EF4444", gradientId: "suspicionGradient" },
  ],
  payment: [
    { dataKey: "enters",   name: "총 입장",    color: "#8B5CF6", gradientId: "enterGradient" },
    { dataKey: "payments", name: "결제 완료",  color: "#10B981", gradientId: "paymentGradient" },
  ],
} as const;

export default function AnalyticsChart({ data, height, variant = "behavior" }: AnalyticsChartProps) {
  const series = SERIES[variant];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 8, left: 8, bottom: 20 }}
      >
        <defs>
          {series.map(({ gradientId, color }) => (
            <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#404040"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#62748e",
            fontSize: 10,
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
          tickFormatter={formatTick}
          dy={6}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020618",
            border: "1px solid #1d293d",
            borderRadius: "8px",
            fontSize: "11px",
            color: "#90a1b9",
          }}
          labelStyle={{ color: "#62748e" }}
        />
        {series.map(({ dataKey, name, color, gradientId }) => (
          <Area
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
