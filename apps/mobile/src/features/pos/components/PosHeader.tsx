import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PosHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-surface-page border-b border-input-border items-center justify-center"
      style={{ paddingTop: insets.top, height: 56 + insets.top }}
    >
      <Text className="text-label text-[10px] font-mono tracking-widest uppercase">
        POS 결제 내역
      </Text>
      <Text className="text-heading text-[13px] font-bold tracking-tight">
        KIS 무인 결제 v3.2
      </Text>
    </View>
  );
}
