import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePayment, cn } from '@xross/core';
import type { PosTransaction, TransactionStatus, PaymentMethod } from '@xross/core';
import type { RootStackParamList } from '@/app/navigation/types';
import { colors } from '@xross/tokens';

const STATUS_CONFIG: Record<TransactionStatus, {
  label: string; rowBg: string; expandBg: string;
  badgeBg: string; badgeText: string; badgeBorder: string;
}> = {
  normal: {
    label: '정상 결제',
    rowBg: 'bg-transparent',
    expandBg: 'bg-[rgba(255,255,255,0.03)]',
    badgeBg: 'bg-[rgba(0,212,146,0.1)]',
    badgeText: 'text-monitor-accent-green',
    badgeBorder: 'border-[rgba(0,212,146,0.3)]',
  },
  unpaid: {
    label: '미결제 의심',
    rowBg: 'bg-[rgba(251,44,54,0.08)]',
    expandBg: 'bg-[rgba(251,44,54,0.06)]',
    badgeBg: 'bg-[rgba(251,44,54,0.1)]',
    badgeText: 'text-event-critical',
    badgeBorder: 'border-[rgba(251,44,54,0.3)]',
  },
  mismatch: {
    label: '장바구니 불일치',
    rowBg: 'bg-[rgba(254,200,0,0.07)]',
    expandBg: 'bg-[rgba(254,200,0,0.06)]',
    badgeBg: 'bg-[rgba(254,154,0,0.1)]',
    badgeText: 'text-event-warning',
    badgeBorder: 'border-[rgba(254,154,0,0.3)]',
  },
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  card: '카드', cash: '현금', mobile: '모바일', qr_code: 'QR',
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
const PAYMENT_ICON: Record<PaymentMethod, IoniconName> = {
  card: 'card-outline', cash: 'cash-outline',
  mobile: 'phone-portrait-outline', qr_code: 'qr-code-outline',
};

function TransactionDetail({ tx }: { tx: PosTransaction }) {
  const { data: payment, isLoading } = usePayment(tx.paymentId);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cfg = STATUS_CONFIG[tx.status];
  const isUnpaid = tx.status === 'unpaid';
  const isMismatch = tx.status === 'mismatch';
  const items = payment?.items ?? [];
  const total = Number(payment?.totalAmount ?? 0);
  const detectedMismatch = payment != null && !payment.isMatchedToCart;

  return (
    <View className={cn('border-t border-monitor-border px-4 py-4 gap-4', cfg.expandBg)}>
      {/* 결제 상품 */}
      <View>
        <Text className="text-monitor-text-dim text-11 font-medium uppercase tracking-wider mb-2">
          결제 상품
        </Text>

        {isUnpaid ? (
          <View className="flex-row items-center gap-2 rounded-lg border border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.07)] px-3 py-3">
            <Ionicons name="shield-outline" size={14} color={colors.event.critical} />
            <Text className="text-13 text-event-critical flex-1">
              결제 기록 없음 — 미결제 퇴장 감지됨
            </Text>
          </View>
        ) : isLoading ? (
          <ActivityIndicator size="small" color="#51a2ff" />
        ) : items.length === 0 ? (
          <Text className="text-monitor-text-muted text-[13px]">상품 정보 없음</Text>
        ) : (
          <>
            {detectedMismatch && (
              <View className="flex-row items-center gap-2 rounded-lg border border-[rgba(254,154,0,0.25)] bg-[rgba(254,154,0,0.08)] px-3 py-2 mb-3">
                <Ionicons name="warning-outline" size={13} color="#fe9a00" />
                <Text className="text-event-warning text-xs flex-1">
                  장바구니 수량·품목과 결제 내역이 일치하지 않습니다
                </Text>
              </View>
            )}

            <View className="flex-row border-b border-monitor-border pb-1.5 mb-1">
              <Text className="flex-1 text-[11px] text-monitor-text-dim font-medium">상품명</Text>
              <Text className="w-8 text-[11px] text-monitor-text-dim font-medium text-right">수량</Text>
              <Text className="w-[72px] text-[11px] text-monitor-text-dim font-medium text-right">단가</Text>
              <Text className="w-[72px] text-[11px] text-monitor-text-dim font-medium text-right">소계</Text>
            </View>

            {items.map((item) => (
              <View key={item.id} className="flex-row border-b border-monitor-border py-[4.5px]">
                <Text className="flex-1 text-[13px] text-monitor-text" numberOfLines={1}>
                  {item.product?.name ?? `상품 #${item.productId}`}
                </Text>
                <Text className="w-8 text-[13px] text-monitor-text text-right">{item.quantity}</Text>
                <Text className="w-[72px] text-[13px] text-monitor-text text-right">
                  {Number(item.unitPrice).toLocaleString('ko-KR')}원
                </Text>
                <Text className="w-[72px] text-[13px] text-monitor-text text-right">
                  {Number(item.subtotal).toLocaleString('ko-KR')}원
                </Text>
              </View>
            ))}

            <View className="flex-row pt-1.5">
              <Text className="flex-1 text-[11px] text-monitor-text-dim text-right pr-2">합계</Text>
              <Text className="w-[72px] text-[13px] text-monitor-text font-semibold text-right">
                {total.toLocaleString('ko-KR')}원
              </Text>
            </View>
          </>
        )}
      </View>

      {/* 상세 정보 */}
      <View className="gap-2">
        <Text className="text-monitor-text-dim text-[11px] font-medium uppercase tracking-wider mb-1">
          상세 정보
        </Text>

        {tx.trackingId && (
          <View className="flex-row justify-between">
            <Text className="text-[13px] text-monitor-text-dim">비전 AI 추적 ID</Text>
            <Text className={cn('text-[13px] font-medium font-mono', isUnpaid ? 'text-event-critical' : 'text-monitor-text-muted')}>
              {tx.trackingId}
            </Text>
          </View>
        )}

        {payment && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-[13px] text-monitor-text-dim">결제 총액</Text>
              <Text className="text-[13px] text-monitor-text font-semibold">
                {total.toLocaleString('ko-KR')}원
              </Text>
            </View>
            {payment.externalPaymentId && (
              <View className="flex-row justify-between">
                <Text className="text-[13px] text-monitor-text-dim">결제 ID</Text>
                <Text className="text-[11px] text-monitor-text-muted font-mono">
                  {payment.externalPaymentId}
                </Text>
              </View>
            )}
          </>
        )}

        {tx.note && (
          <View className={cn(
            'mt-1 rounded-lg border px-3 py-2.5',
            isUnpaid
              ? 'border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.08)]'
              : 'border-[rgba(254,154,0,0.2)] bg-[rgba(254,154,0,0.07)]',
          )}>
            <Text className={cn('text-[11px] leading-[17px]', isUnpaid ? 'text-event-critical' : 'text-event-warning')}>
              {tx.note}
            </Text>
          </View>
        )}

        {tx.alertId && (
          <Pressable
            onPress={() => navigation.navigate('AlertDetail', { id: tx.alertId! })}
            className="mt-2 flex-row items-center justify-center gap-2 rounded-lg border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)] px-3 py-2.5"
          >
            <Ionicons name="open-outline" size={12} color="#ff6467" />
            <Text className="text-[12px] font-medium text-event-critical">알림 상세 검토 →</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function TransactionCard({ transaction: tx }: { transaction: PosTransaction }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[tx.status];
  const isUnpaid = tx.status === 'unpaid';

  return (
    <View className="border-b border-monitor-border">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className={cn('flex-row items-center px-4 py-3 gap-3', cfg.rowBg)}
      >
        <View className="w-[80px]">
          <Text className="text-monitor-text font-mono text-[13px] font-semibold leading-4">{tx.id}</Text>
          <Text className="text-monitor-text-dim text-[11px] leading-[15px]">{tx.time}</Text>
        </View>

        {/* 헤더와 정렬을 위해 고정 폭 w-[92px] */}
        <View className="w-[92px]">
          <View className={cn('rounded-md border px-2 py-1 self-start', cfg.badgeBg, cfg.badgeBorder)}>
            <Text className={cn('text-[10px] font-bold', cfg.badgeText)} numberOfLines={1}>{cfg.label}</Text>
          </View>
        </View>

        <View className="flex-1 flex-row items-center gap-1">
          {tx.paymentMethod ? (
            <>
              <Ionicons name={PAYMENT_ICON[tx.paymentMethod]} size={13} color="#90a1b9" />
              <Text className="text-monitor-text-muted text-xs">{PAYMENT_LABEL[tx.paymentMethod]}</Text>
            </>
          ) : (
            <Text className="text-monitor-text-dim text-[13px]">—</Text>
          )}
        </View>

        {isUnpaid ? (
          <Text className="text-[12px] text-event-critical">없음</Text>
        ) : tx.paymentId ? (
          <Text className="text-monitor-text-dim font-mono text-[11px]">#{tx.paymentId}</Text>
        ) : (
          <Text className="text-monitor-text-dim text-[13px]">—</Text>
        )}

        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#62748e"
        />
      </Pressable>

      {expanded && <TransactionDetail tx={tx} />}
    </View>
  );
}
