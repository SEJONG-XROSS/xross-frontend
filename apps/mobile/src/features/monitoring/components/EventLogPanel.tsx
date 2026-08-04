import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { AlertResponse, AlertSortKey } from '@xross/core';
import { cn, sortAlerts } from '@xross/core';
import { EventCard } from './EventCard';

interface Props {
  alerts: AlertResponse[];
  connected?: boolean;
}

const SORT_OPTIONS: { key: AlertSortKey; label: string }[] = [
  { key: 'recent', label: '최신순' },
  { key: 'priority', label: '중요도순' },
];

export function EventLogPanel({ alerts, connected }: Props) {
  const [sortKey, setSortKey] = useState<AlertSortKey>('recent');

  const sortedAlerts = useMemo(
    () => sortAlerts(alerts, sortKey),
    [alerts, sortKey],
  );

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
          <View className="rounded-badge px-2 py-[3px] bg-event-critical/10 border border-event-critical/20">
            <Text className="text-10 font-bold text-event-critical">
              {criticalCount}건 검토 필요
            </Text>
          </View>
        )}
      </View>

      {/* 정렬 토글 */}
      <View className="px-4 py-2 border-b border-monitor-border">
        <View className="flex-row gap-1 rounded-control p-1 bg-white/10">
          {SORT_OPTIONS.map(({ key, label }) => {
            const active = sortKey === key;
            return (
              <Pressable
                key={key}
                onPress={() => setSortKey(key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className={cn(
                  'flex-1 items-center justify-center rounded-md py-1.5',
                  active ? 'bg-monitor-card-bg' : 'bg-transparent',
                )}
              >
                <Text
                  className={cn(
                    'text-11 font-semibold tracking-wide',
                    active ? 'text-monitor-accent-blue' : 'text-monitor-text-dim',
                  )}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {sortedAlerts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-monitor-text-dim">탐지된 이벤트가 없습니다.</Text>
        </View>
      ) : (
        <FlashList
          data={sortedAlerts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <EventCard alert={item} />}
          estimatedItemSize={120}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}
