import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAlertSeverity } from '@xross/core';
import type { AlertResponse } from '@xross/core';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import { cn } from '@xross/core';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Severity = 'critical' | 'warning' | 'info';

const SEVERITY_CONFIG: Record<Severity, {
  borderClass: string;
  iconBgClass: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  titleClass: string;
}> = {
  critical: {
    borderClass: 'border-event-critical/40',
    iconBgClass: 'bg-event-critical',
    iconName: 'shield-outline',
    titleClass: 'text-event-critical',
  },
  warning: {
    borderClass: 'border-event-warning/40',
    iconBgClass: 'bg-event-warning',
    iconName: 'warning-outline',
    titleClass: 'text-event-warning',
  },
  info: {
    borderClass: 'border-monitor-border',
    iconBgClass: 'bg-monitor-border',
    iconName: 'information-circle-outline',
    titleClass: 'text-monitor-text-muted',
  },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function EventCard({ alert }: { alert: AlertResponse }) {
  const navigation = useNavigation<Nav>();
  const severity = getAlertSeverity(alert.priority);
  const cfg = SEVERITY_CONFIG[severity];

  return (
    <Pressable
      onPress={() => navigation.navigate('AlertDetail', { id: alert.id })}
      className={cn(
        'bg-monitor-card-bg rounded-card border p-[14px] mb-[10px]',
        cfg.borderClass,
        alert.status === 'ACKNOWLEDGED' && 'opacity-50',
      )}
    >
      <View className="flex-row items-start gap-[10px]">
        <View className={cn('w-7 h-7 rounded-[10px] items-center justify-center mt-0.5', cfg.iconBgClass)}>
          <Ionicons name={cfg.iconName} size={14} color="#fff" />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className={cn('text-sm font-bold tracking-tight', cfg.titleClass)}>
            {alert.title}
          </Text>
          <Text className="text-10 text-monitor-text-dim font-mono">
            {formatTime(alert.createdAt)} • #{alert.id}
          </Text>
        </View>
      </View>
      <Text className="mt-[10px] pl-[38px] text-xs text-monitor-text-muted leading-[18px]">
        {alert.message}
      </Text>
    </Pressable>
  );
}
