import React, { useState } from 'react';
import { View, Text, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsRow } from '../components/SettingsRow';

function InlineTag({ label, variant = 'blue' }: { label: string; variant?: 'blue' | 'gray' }) {
  if (variant === 'blue') {
    return (
      <View className="h-[21px] items-center rounded-[4px] border border-[rgba(43,127,255,0.2)] bg-[rgba(43,127,255,0.1)] px-1.5 justify-center">
        <Text className="text-monitor-accent-blue font-mono text-[10px]">{label}</Text>
      </View>
    );
  }
  return (
    <View className="h-[19px] items-center rounded-[4px] bg-monitor-card-bg px-1.5 justify-center">
      <Text className="text-monitor-text-muted font-mono text-[10px]">{label}</Text>
    </View>
  );
}

export function SystemTab() {
  const [autoRecord, setAutoRecord] = useState(true);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6 px-4 py-5">
        <SettingsSection title="탐지 엔진">
          <SettingsRow label="비전 AI 모델">
            <Text className="text-monitor-text-muted font-mono text-sm">YOLOv8-m + ByteTrack</Text>
          </SettingsRow>
          <SettingsRow label="추론 레이턴시">
            <Text className="text-monitor-accent-green font-mono text-sm">14ms avg</Text>
          </SettingsRow>
          <SettingsRow label="행동 분류" hasBorder={false}>
            <View className="flex-row flex-wrap gap-1 justify-end max-w-[180px]">
              {['Pick', 'Put Back', 'Carry', '은닉'].map((tag) => (
                <InlineTag key={tag} label={tag} variant="blue" />
              ))}
            </View>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="이벤트 로그">
          <SettingsRow label="자동 기록" description="이벤트 발생 시 자동 저장">
            <Switch
              value={autoRecord}
              onValueChange={setAutoRecord}
              trackColor={{ false: '#314158', true: '#51a2ff' }}
              thumbColor="#fff"
            />
          </SettingsRow>
          <SettingsRow label="보관 기간" hasBorder={false}>
            <Text className="text-monitor-text-muted font-mono text-sm">30일</Text>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="데이터 관리">
          <View className="px-4 py-4 gap-2">
            <Pressable
              className="h-10 flex-row items-center gap-2 rounded-[10px] border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)] px-4 self-start"
              style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Ionicons name="trash-outline" size={13} color="#ff6467" />
              <Text className="text-[13px] font-medium text-event-critical">이벤트 로그 초기화</Text>
            </Pressable>
            <Text className="text-[11px] text-monitor-text-dim">
              초기화 후 복구 불가. 신중히 사용하세요.
            </Text>
          </View>
        </SettingsSection>

        <SettingsSection title="앱 정보">
          <SettingsRow label="버전">
            <Text className="text-monitor-text-muted font-mono text-sm">1.0.0</Text>
          </SettingsRow>
          <SettingsRow label="빌드" hasBorder={false}>
            <InlineTag label="DEBUG" variant="gray" />
          </SettingsRow>
        </SettingsSection>
      </View>
    </ScrollView>
  );
}
