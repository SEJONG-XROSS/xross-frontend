import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/auth/store';
import { setOnUnauthorized } from '@/shared/api/client';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// 푸시 딥링크 등 NavigationContainer 외부에서 imperative navigation이 필요할 때 사용
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator() {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // client.ts에서 이미 clearAuth()를 호출하므로 Zustand 상태 변화로 Auth 스택 전환
    // 이 콜백은 추가 side-effect(토스트, 로그 등)용
    setOnUnauthorized(() => {
      // P13 이후 토스트/알럿 연결 예정
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
