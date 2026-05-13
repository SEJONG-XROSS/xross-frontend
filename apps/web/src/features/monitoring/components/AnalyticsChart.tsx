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
}

function formatTick(value: string): string {
  return value.replace(":00", "시");
}

export default function AnalyticsChart({ data, height }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 8, left: 8, bottom: 20 }}
      >
        <defs>
          <linearGradient id="pickGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="suspicionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
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
        <Area
          type="monotone"
          dataKey="picks"
          name="Pick 행동"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#pickGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#3B82F6" }}
        />
        <Area
          type="monotone"
          dataKey="suspicions"
          name="미결제 의심"
          stroke="#EF4444"
          strokeWidth={2}
          fill="url(#suspicionGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#EF4444" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
