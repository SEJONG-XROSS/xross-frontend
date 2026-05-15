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

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !mutation.isPending;

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
      <View className="mb-8 items-center">
        {/* 로고 */}
        <View
          className="mb-4 size-[60px] items-center justify-center rounded-2xl bg-white"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text className="text-3xl font-black text-monitor-bg">X</Text>
        </View>

        <Text className="text-[22px] font-bold tracking-tight text-monitor-text">
          XROSS
        </Text>
        <Text className="mt-1 text-sm font-medium tracking-wide text-monitor-text-muted">
          무인점포 실시간 관제 플랫폼
        </Text>

        <View className="mt-5 w-full items-center rounded-2xl border border-monitor-border bg-monitor-card-bg px-5 py-4">
          <Text className="text-[15px] font-bold tracking-tight text-monitor-text">
            비전 AI
            <Text className="font-light text-monitor-text-dim">{'  |  '}</Text>
            무게 센서
            <Text className="font-light text-monitor-text-dim">{'  |  '}</Text>
            POS
          </Text>
          <Text className="mt-1 text-center text-[13px] leading-relaxed text-monitor-text-muted">
            <Text className="font-semibold text-monitor-accent-blue">
              3단계 교차 검증
            </Text>
            으로 매장을 안전하게.
          </Text>
        </View>
      </View>

      {/* ── 폼 ── */}
      <View className="gap-3">
        <View className="mb-2">
          <Text className="text-2xl font-medium tracking-tight text-monitor-text">
            관제 로그인
          </Text>
          <Text className="mt-1 text-sm text-monitor-text-muted">
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
          submitBehavior="submit"
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
          <Text className="text-sm text-event-critical">
            {mutation.error?.message ?? '로그인에 실패했습니다.'}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="mt-2 h-11 items-center justify-center rounded-[10px] bg-brand-primary"
          style={({ pressed }) => ({
            opacity: pressed || !canSubmit ? 0.6 : 1,
          })}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-sm font-medium text-brand-on-primary">
              로그인
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}
