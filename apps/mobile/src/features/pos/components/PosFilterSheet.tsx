import React, { useRef, useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@xross/core';
import type { PosFilters, StatusFilterOption, PaymentFilterOption } from '@xross/core';
import { CalendarPicker } from '@/features/monitoring/components/CalendarPicker';
import { getTodayStr } from '@xross/core';

interface Props {
  visible: boolean;
  filters: PosFilters;
  onChange: (f: PosFilters) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: StatusFilterOption; label: string }[] = [
  { value: 'all', label: '전체 상태' },
  { value: 'normal', label: '정상 결제' },
  { value: 'unpaid', label: '미결제 의심' },
  { value: 'mismatch', label: '장바구니 불일치' },
];

const PAYMENT_OPTIONS: { value: PaymentFilterOption; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'card', label: '카드' },
  { value: 'cash', label: '현금' },
  { value: 'mobile', label: '모바일' },
  { value: 'qr_code', label: 'QR' },
];

function ChipRow<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 border',
            value === opt.value
              ? 'bg-monitor-accent-blue border-monitor-accent-blue'
              : 'bg-monitor-card-bg border-monitor-border',
          )}
        >
          <Text className={cn('text-xs font-medium', value === opt.value ? 'text-white' : 'text-monitor-text-muted')}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function PosFilterSheet({ visible, filters, onChange, onClose }: Props) {
  const [calVisible, setCalVisible] = React.useState<'from' | 'to' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const today = getTodayStr();

  const translateY = useRef(new Animated.Value(600)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 600, duration: 250, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
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
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 120 || vy > 0.8) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        {/* 딤 오버레이 */}
        <Animated.View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: overlayOpacity }}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* 바텀 시트 */}
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-monitor-bg rounded-t-2xl px-5 pt-3 pb-8"
          style={{ transform: [{ translateY }] }}
        >
          {/* 드래그 핸들 */}
          <View {...panResponder.panHandlers} className="items-center py-3 -mx-5 px-5">
            <View className="w-10 h-1 bg-monitor-border rounded-full" />
          </View>

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-monitor-text text-base font-bold">필터</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color="#90a1b9" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 날짜 */}
            <Text className="text-monitor-text-muted text-xs font-semibold uppercase tracking-widest mb-2">날짜</Text>
            <View className="flex-row gap-2 mb-5">
              {(['from', 'to'] as const).map((key) => (
                <Pressable
                  key={key}
                  onPress={() => setCalVisible(key)}
                  className="flex-1 h-10 flex-row items-center justify-between px-3 rounded-lg border border-monitor-border bg-monitor-card-bg"
                >
                  <Text className={cn('text-xs', filters.dateRange[key] ? 'text-monitor-text' : 'text-monitor-text-dim')}>
                    {filters.dateRange[key] ?? (key === 'from' ? '시작일' : '종료일')}
                  </Text>
                  <Ionicons name="calendar-outline" size={13} color="#62748e" />
                </Pressable>
              ))}
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Pressable
                  onPress={() => onChange({ ...filters, dateRange: { from: null, to: null } })}
                  className="w-10 h-10 items-center justify-center rounded-lg border border-monitor-border bg-monitor-card-bg"
                >
                  <Ionicons name="close" size={14} color="#90a1b9" />
                </Pressable>
              )}
            </View>

            {/* 상태 */}
            <Text className="text-monitor-text-muted text-xs font-semibold uppercase tracking-widest mb-2">상태</Text>
            <View className="mb-5">
              <ChipRow
                options={STATUS_OPTIONS}
                value={filters.status}
                onChange={(v) => onChange({ ...filters, status: v })}
              />
            </View>

            {/* 결제 수단 */}
            <Text className="text-monitor-text-muted text-xs font-semibold uppercase tracking-widest mb-2">결제 수단</Text>
            <View className="mb-5">
              <ChipRow
                options={PAYMENT_OPTIONS}
                value={filters.payment}
                onChange={(v) => onChange({ ...filters, payment: v })}
              />
            </View>

            {/* 초기화 */}
            <Pressable
              onPress={() => onChange({ search: '', dateRange: { from: null, to: null }, status: 'all', payment: 'all' })}
              className="h-10 items-center justify-center rounded-lg border border-monitor-border"
            >
              <Text className="text-monitor-text-muted text-sm">필터 초기화</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>

      <CalendarPicker
        visible={calVisible !== null}
        selected={
          calVisible === 'from'
            ? (filters.dateRange.from ?? today)
            : (filters.dateRange.to ?? today)
        }
        onSelect={(date) => {
          if (calVisible) {
            onChange({ ...filters, dateRange: { ...filters.dateRange, [calVisible]: date } });
          }
          setCalVisible(null);
        }}
        onClose={() => setCalVisible(null)}
      />
    </Modal>
  );
}
