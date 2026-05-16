import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { SvgProps } from 'react-native-svg';
import type { MainTabParamList } from './types';
import { MonitoringNavigator } from './MonitoringNavigator';
import { PosScreen } from '@/features/pos/screens/PosScreen';
import { SettingScreen } from '@/features/setting/screens/SettingScreen';
import ShieldIcon from '@/assets/icons/shield.svg';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_BAR_STYLE = {
  backgroundColor: '#f8fafc',
  borderTopColor: '#e2e8f0',
  borderTopWidth: 1,
} as const;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, [IoniconName, IoniconName]> = {
  Monitoring: ['eye', 'eye-outline'],   // 사용 안 함 — Monitoring은 ShieldIcon 사용
  Pos: ['receipt', 'receipt-outline'],
  Setting: ['settings', 'settings-outline'],
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Monitoring: '관제',
  Pos: 'POS',
  Setting: '설정',
};

const ShieldSvg = ShieldIcon as React.FC<SvgProps>;

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: '#155dfc',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabel: TAB_LABELS[route.name as keyof MainTabParamList],
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Monitoring') {
            return <ShieldSvg width={size} height={size} color={color} />;
          }
          const [active, inactive] = TAB_ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringNavigator} />
      <Tab.Screen name="Pos" component={PosScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}
