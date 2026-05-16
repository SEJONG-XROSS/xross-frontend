import React from 'react';
import { View, Text } from 'react-native';
import type { EventResponse, AlertResponse } from '@xross/core';

interface Stat {
  label: string;
  value: string;
  variant?: 'default' | 'danger' | 'success';
}

interface Props {
  stats: Stat[];
}

const STAT_COLOR = {
  default: '#e2e8f0',
  danger: '#ff6467',
  success: '#00d492',
};

export function AnalyticsPanel({ stats }: Props) {
  return (
    <View style={{
      backgroundColor: '#0f172b',
      borderTopWidth: 1, borderTopColor: '#1d293d',
      paddingHorizontal: 16, paddingVertical: 12,
    }}>
      <Text style={{
        fontSize: 10, fontWeight: '700', color: '#90a1b9',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
      }}>
        매장 행동 분석 통계
      </Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {stats.map((stat, i) => (
          <View
            key={stat.label}
            style={{
              flex: 1,
              paddingLeft: i > 0 ? 16 : 0,
              borderLeftWidth: i > 0 ? 1 : 0,
              borderLeftColor: '#314158',
              alignItems: 'flex-end',
            }}
          >
            <Text style={{ fontSize: 11, color: '#62748e', fontFamily: 'monospace' }}>
              {stat.label}
            </Text>
            <Text style={{
              fontSize: 16, fontWeight: '700', color: STAT_COLOR[stat.variant ?? 'default'],
              fontFamily: 'monospace',
            }}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function buildStats(events: EventResponse[], alerts: AlertResponse[]) {
  return [
    { label: '총 입장', value: String(events.filter((e) => e.type === 'ENTER').length) },
    { label: '상품 집기', value: String(events.filter((e) => e.type === 'PICK').length) },
    { label: '이상 감지', value: String(alerts.length), variant: 'danger' as const },
    { label: '결제 완료', value: String(events.filter((e) => e.type === 'PAYMENT_RECEIVED').length), variant: 'success' as const },
  ];
}
