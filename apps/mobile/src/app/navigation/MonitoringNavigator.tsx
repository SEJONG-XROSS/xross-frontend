import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from './types';
import { MonitoringScreen } from '@/features/monitoring/screens/MonitoringScreen';

const Stack = createNativeStackNavigator<MonitoringStackParamList>();

export function MonitoringNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MonitoringHome" component={MonitoringScreen} />
    </Stack.Navigator>
  );
}
