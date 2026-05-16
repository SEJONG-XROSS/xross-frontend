import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@xross/core';
import { AccountTab } from '../tabs/AccountTab';
import { NotificationTab } from '../tabs/NotificationTab';
import { StoreTab } from '../tabs/StoreTab';
import { SystemTab } from '../tabs/SystemTab';
import type { SettingScreenProps } from '@/app/navigation/types';

type Tab = 'account' | 'notification' | 'store' | 'system';

const TABS: { key: Tab; label: string }[] = [
  { key: 'account', label: '계정' },
  { key: 'notification', label: '알림' },
  { key: 'store', label: '매장' },
  { key: 'system', label: '시스템' },
];

export function SettingScreen(_props: SettingScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('account');

  return (
    <View className="flex-1 bg-monitor-bg">
      {/* 헤더 */}
      <View
        className="bg-surface-page border-b border-input-border"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-14 items-center justify-center">
          <Text className="text-heading text-[15px] font-bold">설정</Text>
        </View>

        {/* 세그먼트 탭 컨트롤 */}
        <View className="flex-row px-4 pb-0">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                className="flex-1 items-center pb-2.5 pt-1"
              >
                <Text className={cn('text-[13px] font-medium', active ? 'text-brand-primary' : 'text-body')}>
                  {label}
                </Text>
                {active && (
                  <View className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-primary rounded-full" />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 탭 콘텐츠 */}
      <View className="flex-1 bg-monitor-bg">
        {tab === 'account' && <AccountTab />}
        {tab === 'notification' && <NotificationTab />}
        {tab === 'store' && <StoreTab />}
        {tab === 'system' && <SystemTab />}
      </View>
    </View>
  );
}
