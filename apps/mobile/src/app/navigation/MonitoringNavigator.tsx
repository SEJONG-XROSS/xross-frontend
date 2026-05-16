import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from './types';
import { MonitoringScreen } from '@/features/monitoring/screens/MonitoringScreen';
import { AlertDetailScreen } from '@/features/monitoring/screens/AlertDetailScreen';
import { EventDetailScreen } from '@/features/monitoring/screens/EventDetailScreen';

const Stack = createNativeStackNavigator<MonitoringStackParamList>();

export function MonitoringNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MonitoringHome" component={MonitoringScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}
