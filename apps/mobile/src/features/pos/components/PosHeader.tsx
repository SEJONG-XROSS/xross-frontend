import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PosHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-monitor-card-bg border-b border-monitor-border items-center justify-center"
      style={{ paddingTop: insets.top, height: 56 + insets.top }}
    >
      <Text className="text-monitor-text-dim text-10 font-mono tracking-caps uppercase">
        POS 결제 내역
      </Text>
      <Text className="text-monitor-text text-13 font-bold tracking-tight">
        KIS 무인 결제 v3.2
      </Text>
    </View>
  );
}
