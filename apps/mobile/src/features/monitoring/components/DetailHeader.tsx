import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  subtitle?: string;
}

export function DetailHeader({ title, subtitle }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-monitor-card-bg border-b border-monitor-border"
      style={{ paddingTop: insets.top }}
    >
      <View className="h-14 flex-row items-center px-4 gap-3">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-8 h-8 items-center justify-center"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={colors.monitor['text-dim']} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-monitor-text text-14 font-bold tracking-tight" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-monitor-text-dim text-11 font-mono" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
