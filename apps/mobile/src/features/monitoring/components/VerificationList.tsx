import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { cn } from '@xross/core';
import type { VerificationItem, VerificationStatus, LogEntrySource } from '@xross/core';

const STATUS_LABEL: Record<VerificationStatus, string> = {
  detected: 'DETECTED',
  anomaly: 'ANOMALY',
  match: 'MATCH',
  mismatch: 'MISMATCH',
  'n/a': 'N/A',
  pending: 'PENDING',
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const SOURCE_CONFIG: Record<LogEntrySource, { icon: IoniconName; bgClass: string; colorClass: string }> = {
  vision: { icon: 'eye-outline',       bgClass: 'bg-monitor-accent-blue/10',   colorClass: 'text-monitor-accent-blue' },
  weight: { icon: 'scale-outline',     bgClass: 'bg-monitor-accent-green/10',  colorClass: 'text-monitor-accent-green' },
  pos:    { icon: 'card-outline',      bgClass: 'bg-monitor-accent-purple/10', colorClass: 'text-monitor-accent-purple' },
  system: { icon: 'git-compare-outline', bgClass: 'bg-monitor-border',       colorClass: 'text-monitor-text-muted' },
};

function getAccent(status: VerificationStatus) {
  if (status === 'mismatch') return { bgClass: 'bg-event-critical/10', colorClass: 'text-event-critical' };
  if (status === 'anomaly')  return { bgClass: 'bg-event-warning/10',  colorClass: 'text-event-warning' };
  return null;
}

interface Props {
  items: VerificationItem[];
}

export function VerificationList({ items }: Props) {
  if (!items.length) return null;

  return (
    <View className="border-b border-monitor-border px-4 py-4">
      <View className="flex-row items-center gap-2 mb-4">
        <Ionicons name="git-compare-outline" size={14} color={colors.monitor['text-dim']} />
        <Text className="text-12 font-bold uppercase tracking-caps text-monitor-text-dim">
          시스템 교차 검증 요약
        </Text>
      </View>

      <View className="gap-3">
        {items.map((item) => {
          const src = SOURCE_CONFIG[item.source];
          const accent = getAccent(item.status) ?? { bgClass: src.bgClass, colorClass: src.colorClass };
          const isMismatch = item.status === 'mismatch';

          return (
            <View
              key={item.source}
              className={cn(
                'bg-monitor-card-bg flex-row items-start gap-3 rounded-[10px] border px-4 py-4',
                isMismatch ? 'border-event-critical/30' : 'border-monitor-border',
              )}
            >
              <View className={cn('w-9 h-9 rounded-[10px] items-center justify-center', accent.bgClass)}>
                <Ionicons name={src.icon} size={18} color={isMismatch ? colors.event.critical : undefined} className={accent.colorClass} />
              </View>
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-monitor-text text-sm font-bold tracking-tight flex-1 mr-2" numberOfLines={1}>
                    {item.label}
                  </Text>
                  <View className={cn('rounded-badge px-2 py-[1px]', accent.bgClass)}>
                    <Text className={cn('font-mono text-10', accent.colorClass, isMismatch && 'font-bold')}>
                      {STATUS_LABEL[item.status]}
                    </Text>
                  </View>
                </View>
                <Text className={cn('text-xs leading-4', accent.colorClass)}>
                  {item.detail}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
