import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: Props) {
  return (
    <View>
      <Text className="text-monitor-text-dim text-[11px] font-semibold uppercase tracking-[1.2px] px-4 pb-2">
        {title}
      </Text>
      <View className="bg-monitor-card-bg rounded-xl border border-monitor-border overflow-hidden">
        {children}
      </View>
    </View>
  );
}
