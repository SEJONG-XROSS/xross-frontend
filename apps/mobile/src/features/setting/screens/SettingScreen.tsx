import React from 'react';
import { View, Text } from 'react-native';
import type { SettingScreenProps } from '@/app/navigation/types';

export function SettingScreen(_props: SettingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-monitor-bg">
      <Text className="text-monitor-text text-lg font-semibold">설정</Text>
      <Text className="text-monitor-text-muted text-sm mt-2">P12에서 구현</Text>
    </View>
  );
}
