import React from 'react';
import { View, Text } from 'react-native';
import type { MonitoringScreenProps } from '@/app/navigation/types';

export function MonitoringScreen(_props: MonitoringScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-monitor-bg">
      <Text className="text-monitor-text text-lg font-semibold">모니터링</Text>
      <Text className="text-monitor-text-muted text-sm mt-2">P8에서 구현</Text>
    </View>
  );
}
