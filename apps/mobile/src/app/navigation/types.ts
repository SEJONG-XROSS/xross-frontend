import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// AlertDetail/EventDetail을 Root 레벨로 올려서 어느 탭에서든 push/back 정상 동작
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AlertDetail: { id: number };
  EventDetail: { id: number };
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Monitoring: undefined;
  Pos: undefined;
  Setting: undefined;
};

export type MonitoringStackParamList = {
  MonitoringHome: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type MonitoringScreenProps = BottomTabScreenProps<MainTabParamList, 'Monitoring'>;
export type PosScreenProps = BottomTabScreenProps<MainTabParamList, 'Pos'>;
export type SettingScreenProps = BottomTabScreenProps<MainTabParamList, 'Setting'>;
export type AlertDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AlertDetail'>;
export type EventDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;
