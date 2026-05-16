import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { AlertResponse } from '@xross/core';
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
    <View style={{ flex: 1, backgroundColor: '#0f172b' }}>
      {/* 패널 헤더 */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#1d293d',
        backgroundColor: '#020618',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: connected ? '#00d492' : '#62748e',
          }} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#e2e8f0', letterSpacing: 0.5 }}>
            실시간 탐지 로그
          </Text>
        </View>
        {criticalCount > 0 && (
          <View style={{
            backgroundColor: 'rgba(251,44,54,0.1)',
            borderWidth: 1, borderColor: 'rgba(251,44,54,0.2)',
            borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3,
          }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#ff6467' }}>
              {criticalCount}건 검토 필요
            </Text>
          </View>
        )}
      </View>

      {/* 목록 */}
      {alerts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: '#62748e' }}>탐지된 이벤트가 없습니다.</Text>
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
