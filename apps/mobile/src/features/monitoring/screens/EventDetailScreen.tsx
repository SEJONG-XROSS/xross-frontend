import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import {
  useEventDetails,
  mapEventToDetectionEvent,
  mapEventDetailsToVerification,
  mapEventDetailsToLogEntries,
  useEvents,
  cn,
} from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import type { EventSeverity } from '@xross/core';
import { DetailHeader } from '../components/DetailHeader';
import { VerificationList } from '../components/VerificationList';
import { EventTimeline } from '../components/EventTimeline';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const SEVERITY_ICON: Record<EventSeverity, { icon: IoniconName; color: string }> = {
  critical: { icon: 'shield-outline',    color: colors.event.critical },
  warning:  { icon: 'warning-outline',   color: colors.event.warning },
  behavior: { icon: 'person-outline',    color: colors.event.warning },
  info:     { icon: 'information-circle-outline', color: colors.monitor['text-muted'] },
};

const CONFIDENCE_CLASS: Record<EventSeverity, string> = {
  critical: 'bg-event-critical/10 text-event-critical border-event-critical/20',
  warning:  'bg-event-warning/10 text-event-warning border-event-warning/20',
  behavior: 'bg-event-warning/10 text-event-warning border-event-warning/20',
  info:     'bg-monitor-border text-monitor-text-muted border-monitor-border',
};

export function EventDetailScreen({ route }: Props) {
  const { id } = route.params;
  const storeId = useAuthStore((s) => s.storeId);
  const { data: details = [], isLoading } = useEventDetails(id);
  const { data: events = [] } = useEvents(storeId);

  const eventResponse = events.find((e) => e.id === id);
  const detectionEvent = eventResponse ? mapEventToDetectionEvent(eventResponse) : null;

  const confidence =
    eventResponse?.confidence != null
      ? Math.round(eventResponse.confidence * 100)
      : Math.round((details.find((d) => d.confidence != null)?.confidence ?? 0) * 100);

  const verification = mapEventDetailsToVerification(details);
  const logEntries = mapEventDetailsToLogEntries(details);

  const severity = (detectionEvent?.severity ?? 'info') as EventSeverity;
  const { icon, color } = SEVERITY_ICON[severity];

  return (
    <View className="flex-1 bg-monitor-bg">
      <DetailHeader
        title={detectionEvent?.title ?? `이벤트 #${id}`}
        subtitle={`EVENT #${id}`}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.monitor['accent-blue']} />
        </View>
      ) : !details.length ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-monitor-text-muted text-sm">이벤트 상세 데이터가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* CCTV 플레이스홀더 */}
          <View className="h-[220px] bg-monitor-card-bg border-b border-monitor-border items-center justify-center gap-2">
            <Ionicons name="videocam-off-outline" size={36} color={colors.monitor['text-dim']} />
            <Text className="text-monitor-text-dim text-xs">영상 조회 기능 준비 중</Text>
          </View>

          {/* 이벤트 정보 */}
          <View className="bg-monitor-card-bg border-b border-monitor-border px-4 py-4">
            <View className="flex-row items-start justify-between gap-3 mb-2">
              <View className="flex-row items-start gap-2 flex-1">
                <Ionicons name={icon} size={22} color={color} style={{ marginTop: 2 }} />
                <Text className="flex-1 text-16 font-bold tracking-tight text-monitor-text">
                  {detectionEvent?.title ?? `이벤트 #${id}`}
                </Text>
              </View>
              <View className={cn('rounded-badge border px-2 py-[5px]', CONFIDENCE_CLASS[severity])}>
                <Text className={cn('text-xs font-bold', CONFIDENCE_CLASS[severity].split(' ')[1])}>
                  신뢰도 {confidence}%
                </Text>
              </View>
            </View>
            <Text className="text-13 leading-[21px] text-monitor-text-muted">
              {detectionEvent?.description}
            </Text>
          </View>

          {/* 시스템 교차 검증 */}
          <VerificationList items={verification} />

          {/* 상세 로그 타임라인 */}
          <EventTimeline entries={logEntries} />
        </ScrollView>
      )}
    </View>
  );
}
