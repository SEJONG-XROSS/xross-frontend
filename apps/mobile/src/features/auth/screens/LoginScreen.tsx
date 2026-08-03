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
import { colors } from '@xross/tokens';
import { useAuthStore } from '@/shared/auth/store';
import { TextField } from '@/shared/ui/TextField';
import type { LoginScreenProps } from '@/app/navigation/types';
import LogoSvg from '@/assets/images/logo.svg';

export function LoginScreen(_props: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const mutation = useLogin({
    onSuccess: (token, storeId) => {
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
      className="flex-1 bg-surface-page"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── 브랜딩 ── */}
      <View className="mb-8 items-center">
        {/* 로고 */}
        <View
          className="mb-4 rounded-2xl"
          style={{
            shadowColor: colors.brand.primary,
            shadowOpacity: 0.18,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <LogoSvg width={60} height={60} />
        </View>

        <Text className="text-22 font-bold tracking-tight text-heading">
          XROSS
        </Text>
        <Text className="mt-1 text-sm text-body">
          무인점포 실시간 관제 플랫폼
        </Text>

        {/* 핵심 가치 박스 */}
        <View className="mt-5 w-full items-center rounded-2xl border border-input-border bg-surface-elevated px-5 py-4"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          <Text className="text-14 font-bold tracking-tight text-heading">
            비전 AI
            <Text className="font-light text-body">{'  |  '}</Text>
            무게 센서
            <Text className="font-light text-body">{'  |  '}</Text>
            POS
          </Text>
          <Text className="mt-1 text-center text-13 leading-relaxed text-body">
            <Text className="font-semibold text-brand-primary">3단계 교차 검증</Text>
            으로 매장을 안전하게.
          </Text>
        </View>
      </View>

      {/* ── 폼 ── */}
      <View className="gap-5">
        <View>
          <Text className="text-2xl font-medium tracking-tight text-heading">
            관제 로그인
          </Text>
          <Text className="mt-1 text-sm text-body">
            등록된 매장 관리자 계정으로 로그인하세요.
          </Text>
        </View>

        <View className="gap-4">
          <TextField
            label="이메일"
            placeholder="admin@store.com"
            keyboardType="email-address"
            returnKeyType="next"
            emailVariant
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
        </View>

        {mutation.isError && (
          <Text className="text-sm text-event-critical">
            {mutation.error?.message ?? '로그인에 실패했습니다.'}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-11 items-center justify-center rounded-control bg-brand-primary"
          style={({ pressed }: { pressed: boolean }) => ({
            opacity: pressed || !canSubmit ? 0.7 : 1,
          })}
        >
          {mutation.isPending ? (
            <ActivityIndicator color={colors.brand['on-primary']} size="small" />
          ) : (
            <Text className="text-sm font-semibold text-brand-on-primary">
              로그인
            </Text>
          )}
        </Pressable>

        {/* 개발 전용: 백엔드 없이 화면 확인 */}
        {__DEV__ && (
          <Pressable
            onPress={() => {
              useAuthStore.getState().setAuth('dev-mock-token', 1);
            }}
            className="h-9 items-center justify-center rounded-control border border-input-border"
          >
            <Text className="text-xs text-label">🛠 개발 모드로 진입 (백엔드 없음)</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
