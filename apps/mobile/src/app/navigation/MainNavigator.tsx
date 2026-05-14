import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import { MonitoringScreen } from '@/features/monitoring/screens/MonitoringScreen';
import { PosScreen } from '@/features/pos/screens/PosScreen';
import { SettingScreen } from '@/features/setting/screens/SettingScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_BAR_STYLE = {
  backgroundColor: '#0f172b',
  borderTopColor: '#1d293d',
  borderTopWidth: 1,
} as const;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, [IoniconName, IoniconName]> = {
  Monitoring: ['eye', 'eye-outline'],
  Pos: ['receipt', 'receipt-outline'],
  Setting: ['settings', 'settings-outline'],
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Monitoring: '모니터링',
  Pos: 'POS',
  Setting: '설정',
};

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: '#51a2ff',
        tabBarInactiveTintColor: '#62748e',
        tabBarLabel: TAB_LABELS[route.name as keyof MainTabParamList],
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen name="Pos" component={PosScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}
