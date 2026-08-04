import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { cn } from '@xross/core';
import type { LogEntry, LogEntrySource } from '@xross/core';

const SOURCE_CONFIG: Record<LogEntrySource, { label: string; dotColor: string; bgClass: string; textClass: string }> = {
  vision: { label: 'Vision', dotColor: colors.monitor['accent-blue'],   bgClass: 'bg-monitor-accent-blue/10',   textClass: 'text-monitor-accent-blue' },
  weight: { label: 'Weight', dotColor: colors.monitor['accent-green'],  bgClass: 'bg-monitor-accent-green/10',  textClass: 'text-monitor-accent-green' },
  pos:    { label: 'POS',    dotColor: colors.monitor['accent-purple'], bgClass: 'bg-monitor-accent-purple/10', textClass: 'text-monitor-accent-purple' },
  system: { label: 'System', dotColor: colors.monitor['border-strong'], bgClass: 'bg-monitor-border',           textClass: 'text-monitor-text' },
};

interface Props {
  entries: LogEntry[];
}

export function EventTimeline({ entries }: Props) {
  if (!entries.length) return null;

  return (
    <View className="px-4 py-4">
      {/* 헤더 */}
      <View className="flex-row items-center gap-2 mb-5">
        <Ionicons name="list-outline" size={14} color={colors.monitor['text-dim']} />
        <Text className="text-12 font-bold uppercase tracking-caps text-monitor-text-dim">
          상세 로그 타임라인
        </Text>
      </View>

      {/* 타임라인 */}
      <View className="relative">
        {/* 수직 연결선 */}
        <View
          className="absolute bg-monitor-border"
          style={{ left: 11, top: 8, width: 2, height: Math.max(0, (entries.length - 1) * 72) }}
        />

        {entries.map((entry, idx) => {
          const src = SOURCE_CONFIG[entry.source];
          const dotColor =
            entry.alert === 'critical' ? colors.event.critical :
            entry.alert === 'warning'  ? colors.event.warning :
            src.dotColor;

          return (
            <View key={idx} className="flex-row items-start gap-4 mb-6">
              <View
                className="relative z-10 w-6 h-6 rounded-full border-4 border-monitor-bg items-center justify-center"
                style={{ backgroundColor: dotColor, flexShrink: 0 }}
              >
                <View
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: entry.alert ? colors.monitor.text : colors.monitor.bg }}
                />
              </View>

              <View className="flex-1 gap-1 pt-[2px]">
                <View className="flex-row items-center gap-2">
                  <Text className="font-mono text-10 text-monitor-text-dim">{entry.time}</Text>
                  <View className={cn('rounded-badge px-1.5 py-[1px]', src.bgClass)}>
                    <Text className={cn('font-mono text-10 uppercase tracking-wide', src.textClass)}>
                      {src.label}
                    </Text>
                  </View>
                </View>
                <Text className={cn(
                  'text-sm leading-[19px] tracking-tight',
                  entry.alert === 'critical' ? 'font-semibold text-event-critical' :
                  entry.alert === 'warning'  ? 'font-semibold text-event-warning' :
                  'text-monitor-text-muted',
                )}>
                  {entry.message}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
