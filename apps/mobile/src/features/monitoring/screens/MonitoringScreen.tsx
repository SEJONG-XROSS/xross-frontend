import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { getTodayStr, useAlertStream, useEventStream } from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';
import { cn } from '@xross/core';
import { MonitoringHeader } from '../components/MonitoringHeader';
import { CameraCarousel } from '../components/CameraCarousel';
import { AnalyticsPanel, buildStats, buildChartData } from '../components/AnalyticsPanel';
import { EventLogPanel } from '../components/EventLogPanel';
import { EventLogModal } from '../components/EventLogModal';

type Tab = 'monitor' | 'events';

// id가 MediaMTX 스트림 경로로 사용됨 (웹 camera.id와 동일)
const MOCK_CAMERAS = [
  { id: 'camera1', name: '냉동고 1구역', isOnline: true, isRecording: true, streamPath: 'camera1' },
  { id: 'camera2', name: '스낵/주류 코너', isOnline: false, isRecording: false },
  { id: 'camera3', name: 'POS 셀프 계산대', isOnline: false, isRecording: false },
  { id: 'camera4', name: '입구/출구', isOnline: false, isRecording: false },
];

const TABS: { key: Tab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'monitor', label: '관제', icon: 'shield-outline' },
  { key: 'events', label: '탐지 로그', icon: 'list-outline' },
];

export function MonitoringScreen() {
  const storeId = useAuthStore((s) => s.storeId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [tab, setTab] = useState<Tab>('monitor');
  const [date, setDate] = useState(getTodayStr);
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [eventLogVisible, setEventLogVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStreamEnabled(true);
      return () => setStreamEnabled(false);
    }, []),
  );

  const { alerts, connected } = useAlertStream({ storeId, accessToken, date, enabled: streamEnabled });
  const { events } = useEventStream({ storeId, accessToken, date, enabled: streamEnabled });

  const criticalCount = alerts.filter(
    (a: { status: string }) => a.status === 'PENDING' || a.status === 'SENT',
  ).length;
  const { behaviorStats, paymentStats } = buildStats(events);
  const chartData = buildChartData(events, date);

  return (
    <View className="flex-1 bg-monitor-bg">
      <MonitoringHeader date={date} onDateChange={setDate} />

      {/* 탭 바 */}
      <View className="border-b border-monitor-border bg-monitor-bg px-3 py-2.5">
        <View className="flex-row gap-1 rounded-xl p-1 bg-white/5">
          {TABS.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                className={cn(
                  'flex-1 flex-row items-center justify-center gap-[5px] rounded-control py-2',
                  active ? 'bg-monitor-card-bg' : 'bg-transparent',
                )}
              >
                <Ionicons name={icon} size={13} color={active ? colors.monitor['accent-blue'] : colors.monitor['text-dim']} />
                <Text className={cn('text-11 font-semibold tracking-wide', active ? 'text-monitor-accent-blue' : 'text-monitor-text-dim')}>
                  {label}
                </Text>
                {key === 'events' && criticalCount > 0 && (
                  <View className="bg-event-critical rounded-lg min-w-4 h-4 items-center justify-center px-1">
                    <Text className="text-10 font-bold text-white">{criticalCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 관제 탭 */}
      <View className={cn('flex-1', tab !== 'monitor' && 'hidden')}>
        {/* 카메라 — 항상 노출, WebRTC 유지 */}
        <CameraCarousel cameras={MOCK_CAMERAS} />

        {/* 통계 차트 */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <AnalyticsPanel
            behaviorStats={behaviorStats}
            paymentStats={paymentStats}
            chartData={chartData}
            date={date}
            onOpenEventLog={() => setEventLogVisible(true)}
          />
        </ScrollView>
      </View>
      <View className={cn('flex-1', tab !== 'events' && 'hidden')}>
        <EventLogPanel alerts={alerts} connected={connected} />
      </View>

      <EventLogModal
        visible={eventLogVisible}
        events={events}
        date={date}
        onClose={() => setEventLogVisible(false)}
      />
    </View>
  );
}
