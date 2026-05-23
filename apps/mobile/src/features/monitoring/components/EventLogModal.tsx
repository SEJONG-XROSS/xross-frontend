import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Modal, View, Text, Pressable, TextInput, FlatList, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  critical: { bg: 'rgba(255,100,103,0.12)', text: '#ff6467', border: 'rgba(255,100,103,0.3)' },
  warning:  { bg: 'rgba(254,154,0,0.12)',   text: '#fe9a00', border: 'rgba(254,154,0,0.3)' },
  success:  { bg: 'rgba(0,212,146,0.12)',   text: '#00d492', border: 'rgba(0,212,146,0.3)' },
  info:     { bg: 'rgba(255,255,255,0.06)', text: '#90a1b9', border: '#1d293d' },
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
      <View style={{ flex: 1 }}>
        {/* 오버레이 */}
        <Animated.View
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', opacity: overlayOpacity } as any}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        {/* 시트 */}
        <Animated.View
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: '#0f172b',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderWidth: 1, borderColor: '#1d293d',
            height: '90%',
            transform: [{ translateY }],
          }}
        >
          {/* 드래그 핸들 */}
          <View {...panResponder.panHandlers} style={{ alignItems: 'center', paddingVertical: 12 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#314158' }} />
          </View>

          {/* 헤더 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1d293d' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="list-outline" size={16} color="#51a2ff" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#e2e8f0', letterSpacing: -0.2 }}>
                이벤트 로그
              </Text>
              <View style={{ backgroundColor: '#0d1b2e', borderWidth: 1, borderColor: '#1d293d', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 11, color: '#62748e', fontFamily: 'monospace' }}>
                  {formatDate(date)}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 11, color: '#62748e', fontFamily: 'monospace' }}>
                {filtered.length !== events.length
                  ? `${filtered.length} / ${events.length}건`
                  : `${events.length}건`}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}
                style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="close" size={14} color="#90a1b9" />
              </Pressable>
            </View>
          </View>

          {/* 필터 */}
          <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1d293d' }}>
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setFilter(key)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    paddingHorizontal: 10, paddingVertical: 5,
                    borderRadius: 8,
                    backgroundColor: active ? '#51a2ff' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: active ? '#fff' : '#62748e' }}>
                    {label}
                  </Text>
                  <View style={{ backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#1d293d', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: active ? '#fff' : '#62748e', fontFamily: 'monospace' }}>
                      {filterCounts[key]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* 검색 */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1d293d' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0d1b2e', borderWidth: 1, borderColor: '#1d293d', borderRadius: 10, paddingHorizontal: 12, height: 36 }}>
              <Ionicons name="search-outline" size={14} color="#62748e" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="유형·소스·추적키 검색"
                placeholderTextColor="#62748e"
                style={{ flex: 1, fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace' }}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={14} color="#62748e" />
                </Pressable>
              )}
            </View>
          </View>

          {/* 컬럼 헤더 */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 7, gap: 5, borderBottomWidth: 1, borderBottomColor: '#1d293d', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#62748e', letterSpacing: 1, textTransform: 'uppercase' }}>이벤트 유형</Text>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#62748e', letterSpacing: 1, textTransform: 'uppercase' }}>시각</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#62748e', letterSpacing: 1, textTransform: 'uppercase' }}>소스</Text>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#62748e', letterSpacing: 1, textTransform: 'uppercase' }}>추적키</Text>
            </View>
          </View>

          {/* 목록 */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            ListEmptyComponent={
              <View style={{ paddingTop: 60, alignItems: 'center', gap: 8 }}>
                <Ionicons name="search-outline" size={32} color="#314158" />
                <Text style={{ fontSize: 13, color: '#62748e' }}>해당하는 이벤트가 없습니다.</Text>
              </View>
            }
            renderItem={({ item: event, index }) => {
              const severity: Severity = TYPE_SEVERITY[event.type] ?? 'info';
              const badge = BADGE_STYLE[severity];
              const isEven = index % 2 === 0;
              return (
                <View style={{
                  paddingHorizontal: 16, paddingVertical: 10,
                  backgroundColor: isEven ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottomWidth: 1, borderBottomColor: 'rgba(29,41,61,0.6)',
                  gap: 5,
                }}>
                  {/* 1줄: 유형 뱃지 + 시각 */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ backgroundColor: badge.bg, borderWidth: 1, borderColor: badge.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: badge.text }}>
                        {EVENT_TYPE_LABEL[event.type] ?? event.type}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#62748e', fontFamily: 'monospace' }}>
                      {formatTime(event.occurredAt)}
                    </Text>
                  </View>

                  {/* 2줄: 소스 + 추적키 */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, color: '#62748e' }}>
                      {SOURCE_LABEL[event.source] ?? event.source}
                    </Text>
                    {event.customer?.trackingKey != null ? (
                      <View style={{ backgroundColor: '#0d1b2e', borderWidth: 1, borderColor: '#1d293d', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, color: '#62748e', fontFamily: 'monospace' }}>
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
