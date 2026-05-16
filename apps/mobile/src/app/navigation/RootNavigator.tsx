import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/auth/store';
import { setOnUnauthorized } from '@/shared/api/client';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AlertDetailScreen } from '@/features/monitoring/screens/AlertDetailScreen';
import { EventDetailScreen } from '@/features/monitoring/screens/EventDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator() {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    setOnUnauthorized(() => {
      // P13 이후 토스트/알럿 연결 예정
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            {/* Root 레벨 — 어느 탭에서든 push 가능, back이 올바르게 동작 */}
            <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
