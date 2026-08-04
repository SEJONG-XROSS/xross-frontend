import React, { useState } from 'react';
import { View, Pressable, Text, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsRow } from '../components/SettingsRow';

interface NotificationState {
  mobilePush: boolean;
  sms: boolean;
  email: boolean;
  criticalOnly: boolean;
  storeSound: boolean;
  nightSilent: boolean;
}

export function NotificationTab() {
  const [settings, setSettings] = useState<NotificationState>({
    mobilePush: true,
    sms: true,
    email: false,
    criticalOnly: false,
    storeSound: true,
    nightSilent: false,
  });

  const toggle = (key: keyof NotificationState) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6 px-4 py-5">
        <SettingsSection title="알림 채널">
          <SettingsRow label="모바일 푸시 알림" description="앱 설치 필요">
            <Switch
              value={settings.mobilePush}
              onValueChange={() => toggle('mobilePush')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
          <SettingsRow label="SMS 알림" description="010-1234-5678">
            <Switch
              value={settings.sms}
              onValueChange={() => toggle('sms')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
          <SettingsRow label="이메일 알림" description="일일 요약 리포트 포함" hasBorder={false}>
            <Switch
              value={settings.email}
              onValueChange={() => toggle('email')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="알림 규칙">
          <SettingsRow label="Critical 이벤트만 알림" description="warning/info 등급 차단">
            <Switch
              value={settings.criticalOnly}
              onValueChange={() => toggle('criticalOnly')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
          <SettingsRow label="매장 경고 사운드" description="은닉/미결제 감지 시 재생">
            <Switch
              value={settings.storeSound}
              onValueChange={() => toggle('storeSound')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
          <SettingsRow label="야간 무음 모드" description="22:00 ~ 06:00 음소거" hasBorder={false}>
            <Switch
              value={settings.nightSilent}
              onValueChange={() => toggle('nightSilent')}
              trackColor={{ false: colors.monitor['border-strong'], true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="알림 테스트">
          <View className="px-4 py-4 gap-2">
            <Pressable
              className="h-10 flex-row items-center gap-2 rounded-control border border-monitor-border bg-monitor-card-bg px-5 self-start"
              style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Ionicons name="notifications-outline" size={14} color={colors.monitor.text} />
              <Text className="text-14 font-medium text-monitor-text">테스트 알림 발송</Text>
            </Pressable>
            <Text className="text-12 text-monitor-text-dim">
              설정된 모든 채널로 테스트 알림이 발송됩니다.
            </Text>
          </View>
        </SettingsSection>
      </View>
    </ScrollView>
  );
}
