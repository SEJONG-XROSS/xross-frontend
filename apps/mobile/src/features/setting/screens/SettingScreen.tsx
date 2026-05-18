import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@xross/core';
import { AccountTab } from '../tabs/AccountTab';
import { NotificationTab } from '../tabs/NotificationTab';
import { StoreTab } from '../tabs/StoreTab';
import { SystemTab } from '../tabs/SystemTab';
import type { SettingScreenProps } from '@/app/navigation/types';

type Tab = 'account' | 'notification' | 'store' | 'system';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { key: Tab; label: string; icon: IoniconName }[] = [
  { key: 'account', label: '계정', icon: 'person-outline' },
  { key: 'notification', label: '알림', icon: 'notifications-outline' },
  { key: 'store', label: '매장', icon: 'storefront-outline' },
  { key: 'system', label: '시스템', icon: 'settings-outline' },
];

export function SettingScreen(_props: SettingScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('account');

  return (
    <View className="flex-1 bg-monitor-bg">
      {/* 헤더 */}
      <View
        className="bg-surface-page border-b border-input-border"
        style={{ paddingTop: insets.top, height: 56 + insets.top }}
      >
        <View className="flex-1 items-center justify-center">
          <Text className="text-heading text-[15px] font-bold">설정</Text>
        </View>
      </View>

      {/* 탭바 */}
      <View className="bg-monitor-bg border-b border-monitor-border px-3 py-2.5">
        <View className="flex-row gap-1 rounded-xl bg-[rgba(255,255,255,0.06)] p-1">
          {TABS.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                className={cn(
                  'flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2',
                  active ? 'bg-monitor-card-bg' : '',
                )}
              >
                <Ionicons
                  name={icon}
                  size={14}
                  color={active ? '#51a2ff' : '#62748e'}
                />
                <Text
                  className={cn(
                    'text-[11px] font-semibold tracking-wide',
                    active ? 'text-monitor-accent-blue' : 'text-monitor-text-dim',
                  )}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 탭 콘텐츠 */}
      <View className="flex-1">
        {tab === 'account' && <AccountTab />}
        {tab === 'notification' && <NotificationTab />}
        {tab === 'store' && <StoreTab />}
        {tab === 'system' && <SystemTab />}
      </View>
    </View>
  );
}
