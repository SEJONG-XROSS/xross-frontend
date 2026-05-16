import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTodayStr } from '@xross/core';
import { MonitoringHeader } from '../components/MonitoringHeader';
import { CameraCarousel } from '../components/CameraCarousel';
import { AnalyticsPanel, buildStats } from '../components/AnalyticsPanel';
import { EventLogPanel } from '../components/EventLogPanel';
import { useAlertStream } from '../hooks/useAlertStream';
import { useEventStream } from '../hooks/useEventStream';

type Tab = 'monitor' | 'events';

const MOCK_CAMERAS = [
  { id: 'cam-1', name: '냉동고 1구역', isOnline: true, isRecording: true },
  { id: 'cam-2', name: '스낵/주류 코너', isOnline: false, isRecording: false },
  { id: 'cam-3', name: 'POS 셀프 계산대', isOnline: false, isRecording: false },
  { id: 'cam-4', name: '입구/출구', isOnline: false, isRecording: false },
];

export function MonitoringScreen() {
  const [tab, setTab] = useState<Tab>('monitor');
  const [date, setDate] = useState(getTodayStr);

  const { alerts, connected } = useAlertStream(date);
  const { events } = useEventStream(date);

  const criticalCount = alerts.filter(
    (a) => a.status === 'PENDING' || a.status === 'SENT',
  ).length;
  const stats = buildStats(events, alerts);

  // 화면 비활성 시 스트림 정지 — useAlertStream/useEventStream 내부에서 cleanup으로 처리
  // useFocusEffect는 추후 연결 재개/정지 최적화용으로 유지
  useFocusEffect(
    React.useCallback(() => {
      return () => { /* 포커스 아웃 시 cleanup (훅 내부에서 처리됨) */ };
    }, []),
  );

  const TABS: { key: Tab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { key: 'monitor', label: '관제', icon: 'shield-outline' },
    { key: 'events', label: '탐지 로그', icon: 'list-outline' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172b' }}>
      <MonitoringHeader date={date} onDateChange={setDate} />

      {/* 탭 바 */}
      <View style={{
        borderBottomWidth: 1, borderBottomColor: '#1d293d',
        backgroundColor: '#0f172b', paddingHorizontal: 12, paddingVertical: 10,
      }}>
        <View style={{
          flexDirection: 'row', gap: 4,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 12, padding: 4,
        }}>
          {TABS.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 5, borderRadius: 8, paddingVertical: 8,
                  backgroundColor: active ? '#020618' : 'transparent',
                }}
              >
                <Ionicons
                  name={icon}
                  size={13}
                  color={active ? '#51a2ff' : '#62748e'}
                />
                <Text style={{
                  fontSize: 11, fontWeight: '600', letterSpacing: 0.2,
                  color: active ? '#51a2ff' : '#62748e',
                }}>
                  {label}
                </Text>
                {key === 'events' && criticalCount > 0 && (
                  <View style={{
                    backgroundColor: '#ff6467', borderRadius: 8,
                    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}>
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#fff' }}>
                      {criticalCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 탭 콘텐츠 */}
      {tab === 'monitor' ? (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <CameraCarousel cameras={MOCK_CAMERAS} />
          <AnalyticsPanel stats={stats} />
        </ScrollView>
      ) : (
        <EventLogPanel alerts={alerts} connected={connected} />
      )}
    </View>
  );
}
