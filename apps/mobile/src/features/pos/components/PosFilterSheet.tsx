import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
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
  const today = getTodayStr();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-[rgba(0,0,0,0.5)]">
        <View className="bg-monitor-bg rounded-t-2xl px-5 pt-5 pb-8">
          {/* 핸들 */}
          <View className="w-10 h-1 bg-monitor-border rounded-full self-center mb-4" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-monitor-text text-base font-bold">필터</Text>
            <Pressable onPress={onClose}>
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
        </View>
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
