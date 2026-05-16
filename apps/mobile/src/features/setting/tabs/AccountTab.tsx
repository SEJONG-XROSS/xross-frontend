import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMe, updateProfileApi, authQueryKeys } from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';

const ROLE_LABEL: Record<string, string> = {
  OWNER: '점주',
  ADMIN: '관리자',
};

function ProfileAvatar({ name }: { name: string }) {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <View className="w-16 h-16 rounded-full bg-brand-primary items-center justify-center">
      <Text className="text-white text-2xl font-bold">{initial}</Text>
    </View>
  );
}

function FieldInput({
  value, onChangeText, placeholder, editable = true, keyboardType,
}: {
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View className={`h-[52px] rounded-2xl bg-monitor-card-bg px-4 justify-center border border-monitor-border ${!editable ? 'opacity-60' : ''}`}>
      <TextInput
        className="text-monitor-text text-[15px]"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#62748e"
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

export function AccountTab() {
  const { data: me } = useMe();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  // controlled form — useEffect 동기화 안티패턴 없이 초기값 직접 파생
  const [name, setName] = useState(() => me?.name ?? '');
  const [storeName, setStoreName] = useState(() => me?.storeName ?? '');

  const mutation = useMutation({
    mutationFn: () => updateProfileApi({ name: name.trim(), storeName: storeName.trim() }),
    onSuccess: (data) => {
      queryClient.setQueryData(authQueryKeys.me, data);
      Alert.alert('저장 완료', '프로필이 업데이트됐습니다.');
    },
    onError: (err: Error) => {
      Alert.alert('저장 실패', err.message);
    },
  });

  const isDirty =
    name.trim() !== (me?.name ?? '') ||
    storeName.trim() !== (me?.storeName ?? '');

  return (
    <ScrollView className="flex-1 bg-monitor-bg" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-5 gap-6">
        {/* 프로필 카드 — 웹과 동일한 아바타 + 이름 + 역할·매장 */}
        <View className="bg-monitor-card-bg rounded-2xl border border-monitor-border px-5 py-4 flex-row items-center gap-4">
          <ProfileAvatar name={me?.name ?? ''} />
          <View className="flex-1">
            <Text className="text-monitor-text text-[17px] font-bold">{me?.name ?? '—'}</Text>
            <Text className="text-monitor-text-dim text-[13px] mt-0.5">
              {ROLE_LABEL[me?.role ?? ''] ?? me?.role ?? ''}
              {me?.storeName ? ` · ${me.storeName}` : ''}
            </Text>
          </View>
        </View>

        {/* 입력 필드 */}
        <View className="gap-5">
          <View className="gap-2">
            <Text className="text-monitor-text-muted text-[13px]">이름</Text>
            <FieldInput value={name} onChangeText={setName} placeholder="이름 입력" />
          </View>

          <View className="gap-2">
            <Text className="text-monitor-text-muted text-[13px]">이메일</Text>
            <FieldInput value={me?.email ?? ''} editable={false} keyboardType="email-address" />
          </View>

          <View className="gap-2">
            <Text className="text-monitor-text-muted text-[13px]">매장명</Text>
            <FieldInput value={storeName} onChangeText={setStoreName} placeholder="매장명 입력" />
          </View>
        </View>

        {/* 저장 버튼 */}
        <Pressable
          onPress={() => mutation.mutate()}
          disabled={!isDirty || mutation.isPending}
          className="h-11 flex-row items-center justify-center gap-2 rounded-[10px] bg-brand-primary"
          style={({ pressed }: { pressed: boolean }) => ({
            opacity: pressed || !isDirty || mutation.isPending ? 0.6 : 1,
          })}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={15} color="#fff" />
              <Text className="text-sm font-medium text-white">변경 저장</Text>
            </>
          )}
        </Pressable>

        {/* 로그아웃 */}
        <Pressable
          onPress={clearAuth}
          className="h-11 flex-row items-center justify-center gap-2 rounded-[10px] border border-input-border bg-surface-elevated"
          style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Ionicons name="log-out-outline" size={15} color="#ff6467" />
          <Text className="text-sm font-medium text-event-critical">로그아웃</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
