import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Modal, View, Text, Pressable, TextInput, FlatList, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { cn } from '@xross/core';
import type { EventResponse } from '@xross/core';

interface Props {
  visible: boolean;
  events: EventResponse[];
  date: string;
  onClose: () => void;
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  ENTER: '입장',
  LOCATION_UPDATE: '위치 업데이트',
  SENSOR_TRIGGER: '센서 감지',
  PICK: '상품 집기',
  PUT: '상품 반납',
  BROWSE_ONLY: '진열대 탐색',
  CART_UPDATED: '장바구니 변경',
  PAYMENT_RECEIVED: '결제 완료',
  PAYMENT_MATCHED: '결제 일치',
  PAYMENT_MISMATCH: '장바구니 불일치',
  UNPAID_SUSPICIOUS: '미결제 의심',
  EXIT_LINE_CROSSED: '퇴장 감지',
  LONG_STAY: '장시간 체류',
  FALL_DETECTED: '낙상 감지',
  ALERT_SENT: '알림 발송',
};

const SOURCE_LABEL: Record<string, string> = {
  CEILING_CAMERA: '천장 카메라',
  FREEZER_CAMERA: '냉동고 카메라',
  WEIGHT_SENSOR: '무게 센서',
  POS: 'POS',
  BACKEND: '백엔드',
  SYSTEM: '시스템',
};

type FilterKey = 'all' | 'entry' | 'product' | 'payment' | 'anomaly';

const FILTERS: { key: FilterKey; label: string; types: string[] }[] = [
  { key: 'all',     label: '전체',      types: [] },
  { key: 'entry',   label: '입장·이동', types: ['ENTER', 'LOCATION_UPDATE', 'EXIT_LINE_CROSSED'] },
  { key: 'product', label: '상품',      types: ['PICK', 'PUT', 'BROWSE_ONLY', 'CART_UPDATED', 'SENSOR_TRIGGER'] },
  { key: 'payment', label: '결제',      types: ['PAID', 'PAYMENT_MATCHED'] },
  { key: 'anomaly', label: '이상 감지', types: ['UNPAID_SUSPICIOUS', 'LONG_STAY', 'FALL_DETECTED', 'PAYMENT_MISMATCH'] },
];

type Severity = 'critical' | 'warning' | 'success' | 'info';

const TYPE_SEVERITY: Record<string, Severity> = {
  UNPAID_SUSPICIOUS: 'critical',
  FALL_DETECTED: 'critical',
  PAYMENT_MISMATCH: 'warning',
  LONG_STAY: 'warning',
  ALERT_SENT: 'warning',
  PAYMENT_MATCHED: 'success',
};

const BADGE_STYLE: Record<Severity, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-event-critical/[0.12]',        text: 'text-event-critical',        border: 'border-event-critical/30' },
  warning:  { bg: 'bg-event-warning/[0.12]',         text: 'text-event-warning',         border: 'border-event-warning/30' },
  success:  { bg: 'bg-monitor-accent-green/[0.12]',  text: 'text-monitor-accent-green',  border: 'border-monitor-accent-green/30' },
  info:     { bg: 'bg-white/10',                     text: 'text-monitor-text-muted',    border: 'border-monitor-border' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(dateStr: string) {
  const today = new Date().toLocaleDateString('en-CA');
  if (dateStr === today) return '금일';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function EventLogModal({ visible, events, date, onClose }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useRef(new Animated.Value(800)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 800, duration: 280, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setModalVisible(false));
  };

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      animateOut();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 3,
      onPanResponderMove: (_, { dy }) => { if (dy > 0) translateY.setValue(dy); },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 120 || vy > 0.8) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = { all: events.length, entry: 0, product: 0, payment: 0, anomaly: 0 };
    for (const e of events) {
      for (const f of FILTERS.slice(1)) {
        if (f.types.includes(e.type)) counts[f.key]++;
      }
    }
    return counts;
  }, [events]);

  const filtered = useMemo(() => {
    const filterTypes = FILTERS.find((f) => f.key === filter)?.types ?? [];
    return [...events]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .filter((e) => filterTypes.length === 0 || filterTypes.includes(e.type))
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          EVENT_TYPE_LABEL[e.type]?.includes(q) ||
          SOURCE_LABEL[e.source]?.includes(q) ||
          String(e.customer?.trackingKey ?? '').includes(q)
        );
      });
  }, [events, filter, search]);

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        {/* 오버레이 */}
        <Animated.View
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', opacity: overlayOpacity } as any}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* 시트 */}
        <Animated.View
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: colors.monitor.bg,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderWidth: 1, borderColor: colors.monitor.border,
            height: '90%',
            transform: [{ translateY }],
          }}
        >
          {/* 드래그 핸들 */}
          <View {...panResponder.panHandlers} className="items-center py-3">
            <View className="w-10 h-1 rounded-sm bg-monitor-border-strong" />
          </View>

          {/* 헤더 */}
          <View className="flex-row items-center justify-between px-4 pb-3 border-b border-monitor-border">
            <View className="flex-row items-center gap-2">
              <Ionicons name="list-outline" size={16} color={colors.monitor['accent-blue']} />
              <Text className="text-14 font-bold text-monitor-text tracking-[-0.2px]">
                이벤트 로그
              </Text>
              <View className="bg-monitor-bg border border-monitor-border rounded-badge px-1.5 py-0.5">
                <Text className="text-11 text-monitor-text-dim" style={{ fontFamily: 'monospace' }}>
                  {formatDate(date)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-11 text-monitor-text-dim" style={{ fontFamily: 'monospace' }}>
                {filtered.length !== events.length
                  ? `${filtered.length} / ${events.length}건`
                  : `${events.length}건`}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}
                className="w-7 h-7 rounded-control bg-white/10 items-center justify-center"
              >
                <Ionicons name="close" size={14} color={colors.monitor['text-muted']} />
              </Pressable>
            </View>
          </View>

          {/* 필터 */}
          <View className="flex-row gap-1 px-4 py-2.5 border-b border-monitor-border">
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setFilter(key)}
                  className={cn(
                    'flex-row items-center gap-1 px-2.5 py-[5px] rounded-control',
                    active ? 'bg-monitor-accent-blue' : 'bg-white/5',
                  )}
                >
                  <Text className={cn('text-11 font-semibold', active ? 'text-white' : 'text-monitor-text-dim')}>
                    {label}
                  </Text>
                  <View className={cn('rounded-control px-[5px] py-[1px]', active ? 'bg-white/25' : 'bg-monitor-border')}>
                    <Text
                      className={cn('text-10 font-bold', active ? 'text-white' : 'text-monitor-text-dim')}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {filterCounts[key]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* 검색 */}
          <View className="px-4 py-2 border-b border-monitor-border">
            <View className="flex-row items-center gap-2 bg-monitor-bg border border-monitor-border rounded-control px-3 h-9">
              <Ionicons name="search-outline" size={14} color={colors.monitor['text-dim']} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="유형·소스·추적키 검색"
                placeholderTextColor={colors.monitor['text-dim']}
                className="flex-1 text-12 text-monitor-text"
                style={{ fontFamily: 'monospace' }}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={14} color={colors.monitor['text-dim']} />
                </Pressable>
              )}
            </View>
          </View>

          {/* 컬럼 헤더 */}
          <View className="px-4 py-[7px] gap-[5px] border-b border-monitor-border bg-white/5">
            <View className="flex-row justify-between">
              <Text className="text-10 font-bold text-monitor-text-dim tracking-caps uppercase">이벤트 유형</Text>
              <Text className="text-10 font-bold text-monitor-text-dim tracking-caps uppercase">시각</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-10 font-bold text-monitor-text-dim tracking-caps uppercase">소스</Text>
              <Text className="text-10 font-bold text-monitor-text-dim tracking-caps uppercase">추적키</Text>
            </View>
          </View>

          {/* 목록 */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            ListEmptyComponent={
              <View className="pt-[60px] items-center gap-2">
                <Ionicons name="search-outline" size={32} color={colors.monitor['border-strong']} />
                <Text className="text-13 text-monitor-text-dim">해당하는 이벤트가 없습니다.</Text>
              </View>
            }
            renderItem={({ item: event, index }) => {
              const severity: Severity = TYPE_SEVERITY[event.type] ?? 'info';
              const badge = BADGE_STYLE[severity];
              const isEven = index % 2 === 0;
              return (
                <View
                  className={cn(
                    'px-4 py-2.5 gap-[5px] border-b border-monitor-border/60',
                    isEven ? 'bg-transparent' : 'bg-white/[0.015]',
                  )}
                >
                  {/* 1줄: 유형 뱃지 + 시각 */}
                  <View className="flex-row items-center justify-between">
                    <View className={cn('rounded-badge border px-2 py-1', badge.bg, badge.border)}>
                      <Text className={cn('text-12 font-semibold', badge.text)}>
                        {EVENT_TYPE_LABEL[event.type] ?? event.type}
                      </Text>
                    </View>
                    <Text className="text-11 text-monitor-text-dim" style={{ fontFamily: 'monospace' }}>
                      {formatTime(event.occurredAt)}
                    </Text>
                  </View>

                  {/* 2줄: 소스 + 추적키 */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-11 text-monitor-text-dim">
                      {SOURCE_LABEL[event.source] ?? event.source}
                    </Text>
                    {event.customer?.trackingKey != null ? (
                      <View className="bg-monitor-bg border border-monitor-border rounded-badge px-1.5 py-0.5">
                        <Text className="text-10 text-monitor-text-dim" style={{ fontFamily: 'monospace' }}>
                          #{event.customer.trackingKey}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
