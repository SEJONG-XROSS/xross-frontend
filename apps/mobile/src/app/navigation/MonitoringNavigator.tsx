import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MonitoringStackParamList } from './types';
import { MonitoringScreen } from '@/features/monitoring/screens/MonitoringScreen';

const Stack = createNativeStackNavigator<MonitoringStackParamList>();

// P10에서 실제 구현
function AlertDetailScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172b' }}>
      <Text style={{ color: '#90a1b9' }}>AlertDetail — P10에서 구현</Text>
    </View>
  );
}

function EventDetailScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172b' }}>
      <Text style={{ color: '#90a1b9' }}>EventDetail — P10에서 구현</Text>
    </View>
  );
}

export function MonitoringNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MonitoringHome" component={MonitoringScreen} />
      <Stack.Screen
        name="AlertDetail"
        component={AlertDetailScreen}
        options={{ headerShown: true, title: '알림 상세', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ headerShown: true, title: '이벤트 상세', headerBackTitle: '' }}
      />
    </Stack.Navigator>
  );
}
