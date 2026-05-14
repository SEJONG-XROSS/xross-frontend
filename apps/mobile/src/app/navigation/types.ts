import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Monitoring: undefined;
  Pos: undefined;
  Setting: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type MonitoringScreenProps = BottomTabScreenProps<MainTabParamList, 'Monitoring'>;
export type PosScreenProps = BottomTabScreenProps<MainTabParamList, 'Pos'>;
export type SettingScreenProps = BottomTabScreenProps<MainTabParamList, 'Setting'>;
