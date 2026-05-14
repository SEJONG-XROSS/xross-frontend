import '../styles/global.css'; // NativeWind CSS interop — 최상단에 위치

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from './providers/QueryProvider';
import { AdaptersProvider } from './providers/AdaptersProvider';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryProvider>
            <AdaptersProvider>
              <StatusBar style="light" />
              <RootNavigator />
            </AdaptersProvider>
          </QueryProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
