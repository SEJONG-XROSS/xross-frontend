import React from 'react';
import { View, Text } from 'react-native';
import type { PosScreenProps } from '@/app/navigation/types';

export function PosScreen(_props: PosScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-monitor-bg">
      <Text className="text-monitor-text text-lg font-semibold">POS</Text>
      <Text className="text-monitor-text-muted text-sm mt-2">P11에서 구현</Text>
    </View>
  );
}
