import React, { useState, useMemo, useDeferredValue } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import {
  usePosTransactions,
  buildPosSummary,
  filterTransactions,
  cn,
} from '@xross/core';
import type { PosFilters, PosTransaction } from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';
import { PosHeader } from '../components/PosHeader';
import { PosSummaryCards } from '../components/PosSummaryCards';
import { TransactionCard } from '../components/TransactionCard';
import { PosFilterSheet } from '../components/PosFilterSheet';
import type { PosScreenProps } from '@/app/navigation/types';

const DEFAULT_FILTERS: PosFilters = {
  search: '',
  dateRange: { from: null, to: null },
  status: 'all',
  payment: 'all',
};

export function PosScreen(_props: PosScreenProps) {
  const storeId = useAuthStore((s) => s.storeId);
  const [filters, setFilters] = useState<PosFilters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const deferredSearch = useDeferredValue(filters.search);

  const { transactions, isLoading } = usePosTransactions(storeId);

  const filtered = useMemo(
    () => filterTransactions(transactions, { ...filters, search: deferredSearch }),
    [transactions, filters, deferredSearch],
  );

  const summary = useMemo(() => buildPosSummary(filtered), [filtered]);

  const hasActiveFilter =
    filters.dateRange.from || filters.dateRange.to ||
    filters.status !== 'all' || filters.payment !== 'all';

  return (
    <View className="flex-1 bg-monitor-bg">
      <PosHeader />

      <View className="flex-1">
        {/* 요약 카드 — 최상단 */}
        <View className="px-4 pt-4 pb-3">
          <PosSummaryCards stats={summary} />
        </View>

        {/* 검색 + 필터 */}
        <View className="px-4 pb-3 gap-2">
          <View className="flex-row gap-2">
            <View className="flex-1 flex-row items-center bg-monitor-card-bg border border-monitor-border rounded-lg px-3 h-10 gap-2">
              <Ionicons name="search-outline" size={14} color="#62748e" />
              <TextInput
                className="flex-1 text-monitor-text text-sm"
                placeholderTextColor="#62748e"
                placeholder="거래 ID, 추적 ID 검색..."
                value={filters.search}
                onChangeText={(v) => setFilters((f) => ({ ...f, search: v }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {filters.search.length > 0 && (
                <Pressable onPress={() => setFilters((f) => ({ ...f, search: '' }))}>
                  <Ionicons name="close-circle" size={15} color="#62748e" />
                </Pressable>
              )}
            </View>
            <Pressable
              onPress={() => setFilterOpen(true)}
              className={cn(
                'w-10 h-10 items-center justify-center rounded-lg border',
                hasActiveFilter
                  ? 'bg-monitor-accent-blue border-monitor-accent-blue'
                  : 'bg-monitor-card-bg border-monitor-border',
              )}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={hasActiveFilter ? '#fff' : '#90a1b9'}
              />
            </Pressable>
          </View>
        </View>

        {/* 컬럼 헤더 — TransactionCard 행과 동일한 px-4 gap-3 레이아웃 */}
        <View className="flex-row items-center px-4 py-2.5 border-b border-monitor-border bg-[rgba(255,255,255,0.04)]">
          <Text className="w-[80px] text-[11px] text-monitor-text-dim font-medium uppercase tracking-wider">ID / 시각</Text>
          <View className="w-[92px]">
            <Text className="text-[11px] text-monitor-text-dim font-medium uppercase tracking-wider">상태</Text>
          </View>
          <Text className="flex-1 text-[11px] text-monitor-text-dim font-medium uppercase tracking-wider ml-[3px]">결제 수단</Text>
          <Text className="text-[11px] text-monitor-text-dim font-medium uppercase tracking-wider">결제</Text>
          <View className="w-[14px] ml-3" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#51a2ff" />
          </View>
        ) : (
          <FlashList
            data={filtered}
            keyExtractor={(item) => item.id}
            estimatedItemSize={56}
            renderItem={({ item }: { item: PosTransaction }) => (
              <TransactionCard transaction={item} />
            )}
            ListHeaderComponent={null}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-16 gap-2">
                <Ionicons name="receipt-outline" size={36} color="#62748e" />
                <Text className="text-monitor-text-dim text-sm">거래 내역이 없습니다.</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View className="flex-row items-center justify-between border-t border-monitor-border px-4 py-2.5">
                <Text className="text-monitor-text-dim text-[12px]">
                  {filtered.length}건 표시 중 (전체 {transactions.length}건)
                </Text>
                <Text className="text-monitor-text-dim text-[11px]">탭하면 상세 확인</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>

      <PosFilterSheet
        visible={filterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}
