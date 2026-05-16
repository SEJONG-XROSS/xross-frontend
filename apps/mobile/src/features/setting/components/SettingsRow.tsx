import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  label: string;
  description?: string;
  hasBorder?: boolean;
  children?: React.ReactNode;
}

export function SettingsRow({ label, description, hasBorder = true, children }: Props) {
  return (
    <View className={`flex-row items-center justify-between px-4 py-3.5 gap-3 min-h-[54px] ${hasBorder ? 'border-b border-monitor-border' : ''}`}>
      <View className="flex-1">
        <Text className="text-monitor-text text-sm leading-5 tracking-tight">{label}</Text>
        {description && (
          <Text className="text-monitor-text-dim text-[11px] leading-4 mt-0.5">{description}</Text>
        )}
      </View>
      {children && <View className="flex-shrink-0">{children}</View>}
    </View>
  );
}
