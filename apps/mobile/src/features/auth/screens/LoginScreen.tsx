import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLogin } from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';
import { TextField } from '@/shared/ui/TextField';
import type { LoginScreenProps } from '@/app/navigation/types';

export function LoginScreen(_props: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const mutation = useLogin({
    onSuccess: (token, storeId) => {
      // setAuth → accessToken 변경 → RootNavigator가 Main 스택으로 자동 전환
      useAuthStore.getState().setAuth(token, storeId);
    },
  });

  const canSubmit = email.trim().length > 0 && password.length > 0 && !mutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    mutation.mutate({ email: email.trim(), password });
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-monitor-bg"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── 브랜딩 ── */}
      <View className="items-center mb-8">
        <View
          className="size-[60px] rounded-2xl bg-white items-center justify-center mb-4"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text className="text-monitor-bg text-3xl font-black">X</Text>
        </View>

        <Text className="text-monitor-text text-[22px] font-bold tracking-tight">XROSS</Text>
        <Text className="text-monitor-text-muted text-sm font-medium tracking-wide mt-1">
          무인점포 실시간 관제 플랫폼
        </Text>

        <View className="w-full mt-5 rounded-2xl border border-monitor-border bg-monitor-card-bg px-5 py-4 items-center">
          <Text className="text-monitor-text text-[15px] font-bold tracking-tight">
            비전 AI
            <Text className="text-monitor-text-dim font-light">{'  |  '}</Text>
            무게 센서
            <Text className="text-monitor-text-dim font-light">{'  |  '}</Text>
            POS
          </Text>
          <Text className="text-monitor-text-muted text-[13px] leading-relaxed text-center mt-1">
            <Text className="text-monitor-accent-blue font-semibold">3단계 교차 검증</Text>
            으로 매장을 안전하게.
          </Text>
        </View>
      </View>

      {/* ── 폼 ── */}
      <View className="gap-3">
        <View className="mb-2">
          <Text className="text-monitor-text text-2xl font-medium tracking-tight">관제 로그인</Text>
          <Text className="text-monitor-text-muted text-sm mt-1">
            등록된 매장 관리자 계정으로 로그인하세요.
          </Text>
        </View>

        <TextField
          label="이메일"
          placeholder="admin@store.com"
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />

        <TextField
          ref={passwordRef}
          label="비밀번호"
          placeholder="••••••••"
          password
          returnKeyType="done"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
        />

        {mutation.isError && (
          <Text className="text-event-critical text-sm">
            {mutation.error?.message ?? '로그인에 실패했습니다.'}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-11 rounded-[10px] bg-brand-primary items-center justify-center mt-2"
          style={({ pressed }) => ({ opacity: pressed || !canSubmit ? 0.6 : 1 })}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-brand-on-primary text-sm font-medium">로그인</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}
