import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PosSummaryStats } from '@xross/core';
import { colors } from '@xross/tokens';

interface CardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  value: string;
  sub: string;
  iconColor: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

function SummaryCard({ icon, title, value, sub, iconColor, borderClass, bgClass, textClass }: CardProps) {
  return (
    <View className={`flex-1 rounded-card border px-3 py-3 gap-1 ${borderClass} ${bgClass}`}>
      <View className="flex-row items-center justify-between">
        <Text className={`text-11 font-medium ${textClass}`}>{title}</Text>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <Text className="text-monitor-text text-lg font-bold tracking-tight">{value}</Text>
      <Text className="text-monitor-text-dim text-10">{sub}</Text>
    </View>
  );
}

export function PosSummaryCards({ stats }: { stats: PosSummaryStats }) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <SummaryCard
          icon="receipt-outline"
          title="총 거래"
          value={`${stats.totalCount}건`}
          sub="필터 기간 내"
          iconColor={colors.monitor['accent-blue']}
          borderClass="border-[rgba(81,162,255,0.25)]"
          bgClass="bg-[rgba(81,162,255,0.08)]"
          textClass="text-monitor-accent-blue"
        />
        <SummaryCard
          icon="checkmark-circle-outline"
          title="정상 결제"
          value={`${stats.normalCount}건`}
          sub="교차 검증 완료"
          iconColor={colors.monitor['accent-green']}
          borderClass="border-[rgba(0,212,146,0.25)]"
          bgClass="bg-[rgba(0,212,146,0.08)]"
          textClass="text-monitor-accent-green"
        />
      </View>
      <View className="flex-row gap-2">
        <SummaryCard
          icon="shield-outline"
          title="미결제 의심"
          value={`${stats.unpaidCount}건`}
          sub="결제 기록 없음"
          iconColor={colors.event.critical}
          borderClass="border-[rgba(255,100,103,0.25)]"
          bgClass="bg-[rgba(255,100,103,0.08)]"
          textClass="text-event-critical"
        />
        <SummaryCard
          icon="warning-outline"
          title="장바구니 불일치"
          value={`${stats.mismatchCount}건`}
          sub="수량·품목 불일치"
          iconColor={colors.event.warning}
          borderClass="border-[rgba(254,154,0,0.25)]"
          bgClass="bg-[rgba(254,154,0,0.08)]"
          textClass="text-event-warning"
        />
      </View>
    </View>
  );
}
