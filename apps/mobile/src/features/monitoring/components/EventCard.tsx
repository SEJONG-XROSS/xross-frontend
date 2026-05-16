import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAlertSeverity } from '@xross/core';
import type { AlertResponse } from '@xross/core';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from '@/app/navigation/types';

type Nav = NativeStackNavigationProp<MonitoringStackParamList>;

type Severity = 'critical' | 'warning' | 'info';

const SEVERITY_CONFIG: Record<Severity, {
  borderColor: string;
  iconBg: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  titleColor: string;
}> = {
  critical: {
    borderColor: 'rgba(251,44,54,0.4)',
    iconBg: '#fb2c36',
    iconName: 'shield-outline',
    titleColor: '#ff6467',
  },
  warning: {
    borderColor: 'rgba(254,154,0,0.4)',
    iconBg: '#fe9a00',
    iconName: 'warning-outline',
    titleColor: '#fe9a00',
  },
  info: {
    borderColor: '#1d293d',
    iconBg: '#1d293d',
    iconName: 'information-circle-outline',
    titleColor: '#90a1b9',
  },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function EventCard({ alert }: { alert: AlertResponse }) {
  const navigation = useNavigation<Nav>();
  const severity = getAlertSeverity(alert.priority);
  const cfg = SEVERITY_CONFIG[severity];
  const dimmed = alert.status === 'ACKNOWLEDGED';

  return (
    <Pressable
      onPress={() => navigation.navigate('AlertDetail', { id: alert.id })}
      style={{
        opacity: dimmed ? 0.5 : 1,
        backgroundColor: '#020618',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: cfg.borderColor,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <View style={{
          width: 28, height: 28, borderRadius: 10,
          backgroundColor: cfg.iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginTop: 2,
        }}>
          <Ionicons name={cfg.iconName} size={14} color="#fff" />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: cfg.titleColor, letterSpacing: -0.15 }}>
            {alert.title}
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#62748e' }}>
            {formatTime(alert.createdAt)} • #{alert.id}
          </Text>
        </View>
      </View>
      <Text style={{ marginTop: 10, paddingLeft: 38, fontSize: 12, color: '#90a1b9', lineHeight: 18 }}>
        {alert.message}
      </Text>
    </Pressable>
  );
}
