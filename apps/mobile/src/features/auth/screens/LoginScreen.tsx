import React from 'react';
import { View, Text } from 'react-native';
import type { LoginScreenProps } from '@/app/navigation/types';

export function LoginScreen(_props: LoginScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-monitor-bg">
      <Text className="text-monitor-text text-lg font-semibold">로그인</Text>
      <Text className="text-monitor-text-muted text-sm mt-2">P7에서 구현</Text>
    </View>
  );
}
