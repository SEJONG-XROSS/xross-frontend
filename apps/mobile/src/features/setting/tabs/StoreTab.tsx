import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMe } from '@xross/core';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsRow } from '../components/SettingsRow';

const CAMERAS = [
  { name: '냉동고 1구역', edgeNode: 'Edge-TX2-01', camId: 'cam-01', hasSensor: true },
  { name: '스낵/주류 코너', edgeNode: 'Edge-TX2-02', camId: 'cam-02', hasSensor: false },
  { name: 'POS 셀프 계산대', edgeNode: 'Edge-Nano-01', camId: 'cam-03', hasSensor: false },
  { name: '출입구', edgeNode: 'Edge-Nano-02', camId: 'cam-04', hasSensor: false },
];

export function StoreTab() {
  const { data: me } = useMe();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6 px-4 py-5">
        <SettingsSection title="매장 기본 정보">
          <SettingsRow label="매장 ID">
            <Text className="text-monitor-text-muted font-mono text-sm">
              {me ? String(me.storeId) : '—'}
            </Text>
          </SettingsRow>
          <SettingsRow label="매장명">
            <Text className="text-monitor-text-muted text-sm">{me?.storeName ?? '—'}</Text>
          </SettingsRow>
          <SettingsRow label="운영 시간">
            <Text className="text-monitor-text-muted text-sm">24시간 무인 운영</Text>
          </SettingsRow>
          <SettingsRow label="주소" hasBorder={false}>
            <Ionicons name="chevron-forward" size={16} color="#62748e" />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="카메라 / 엣지 노드 현황">
          {CAMERAS.map((cam, idx) => (
            <View
              key={cam.camId}
              className={`flex-row items-center justify-between px-4 py-3 gap-3 ${idx < CAMERAS.length - 1 ? 'border-b border-monitor-border' : ''}`}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Ionicons name="videocam-outline" size={16} color="#51a2ff" />
                <View>
                  <Text className="text-monitor-text text-sm leading-5">{cam.name}</Text>
                  <Text className="text-monitor-text-dim font-mono text-[11px]">
                    {cam.edgeNode} · {cam.camId}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                {cam.hasSensor && (
                  <View className="h-[21px] flex-row items-center gap-1 rounded-[4px] border border-[rgba(0,212,146,0.2)] bg-[rgba(0,212,146,0.1)] px-1.5">
                    <Ionicons name="scale-outline" size={10} color="#00d492" />
                    <Text className="text-monitor-accent-green font-mono text-[10px]">센서</Text>
                  </View>
                )}
                <View className="w-2 h-2 rounded-full bg-monitor-accent-green" />
              </View>
            </View>
          ))}
        </SettingsSection>

        <SettingsSection title="POS 연동">
          <SettingsRow label="POS 시스템" description="KIS 무인 결제 v3.2">
            <View className="h-[18px] items-center rounded-[4px] border border-[rgba(0,188,125,0.2)] bg-[rgba(0,188,125,0.1)] px-2">
              <Text className="text-[10px] font-mono text-[#009966]">동기화됨</Text>
            </View>
          </SettingsRow>
          <SettingsRow label="결제 검증 모드" description="퇴장 시점 자동 교차 검증" hasBorder={false}>
            <Text className="text-monitor-text-muted font-mono text-sm">EXIT_TRIGGER</Text>
          </SettingsRow>
        </SettingsSection>
      </View>
    </ScrollView>
  );
}
