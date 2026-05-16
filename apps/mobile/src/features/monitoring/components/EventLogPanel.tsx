import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { AlertResponse } from '@xross/core';
import { cn } from '@xross/core';
import { EventCard } from './EventCard';

interface Props {
  alerts: AlertResponse[];
  connected?: boolean;
}

export function EventLogPanel({ alerts, connected }: Props) {
  const criticalCount = alerts.filter(
    (a) => a.status === 'PENDING' || a.status === 'SENT',
  ).length;

  return (
    <View className="flex-1 bg-monitor-bg">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-monitor-border bg-monitor-card-bg">
        <View className="flex-row items-center gap-2">
          <View className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-monitor-accent-green' : 'bg-monitor-text-dim')} />
          <Text className="text-xs font-bold text-monitor-text tracking-wide">
            실시간 탐지 로그
          </Text>
        </View>
        {criticalCount > 0 && (
          <View className="rounded-[4px] px-2 py-[3px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.2)]">
            <Text className="text-[10px] font-bold text-event-critical">
              {criticalCount}건 검토 필요
            </Text>
          </View>
        )}
      </View>

      {alerts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-monitor-text-dim">탐지된 이벤트가 없습니다.</Text>
        </View>
      ) : (
        <FlashList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <EventCard alert={item} />}
          estimatedItemSize={120}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}
