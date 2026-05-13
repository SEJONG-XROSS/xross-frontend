import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/auth/store';

// P6에서 실제 화면으로 교체
const Stack = createNativeStackNavigator();

function PlaceholderScreen() {
  const { View, Text } = require('react-native');
  return (
    <View className="flex-1 items-center justify-center bg-monitor-bg">
      <Text className="text-monitor-text">화면 준비 중...</Text>
    </View>
  );
}

export function RootNavigator() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <Stack.Screen name="Main" component={PlaceholderScreen} />
        ) : (
          <Stack.Screen name="Auth" component={PlaceholderScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
