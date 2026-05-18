import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMe, updateProfileApi, authQueryKeys, cn } from '@xross/core';
import { useAuthStore } from '@/shared/auth/store';
import { SettingsSection } from '../components/SettingsSection';

const ROLE_LABEL: Record<string, string> = {
  OWNER: '점주',
  ADMIN: '관리자',
};

function ProfileAvatar({ name }: { name: string }) {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <View
      className="w-[72px] h-[72px] rounded-full bg-brand-primary items-center justify-center"
      style={{ shadowColor: '#155dfc', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16 }}
    >
      <Text className="text-white text-[28px] font-bold">{initial}</Text>
    </View>
  );
}

function Field({
  label, value, onChangeText, placeholder, editable = true, keyboardType, icon,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address';
  icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View className="px-4 py-3 gap-1.5">
      <View className="flex-row items-center gap-1.5">
        <Ionicons name={icon} size={11} color="#62748e" />
        <Text className="text-monitor-text-dim text-[11px] font-medium uppercase tracking-wider">
          {label}
        </Text>
      </View>
      <TextInput
        className={cn('text-monitor-text text-[15px] py-0', !editable && 'opacity-50')}
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
      <View className="px-4 py-6 gap-6">

        {/* 프로필 헤더 */}
        <View className="items-center gap-3">
          <ProfileAvatar name={me?.name ?? ''} />
          <View className="items-center gap-1">
            <Text className="text-monitor-text text-[18px] font-bold">
              {me?.name ?? '—'}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="rounded-md bg-[rgba(21,93,252,0.12)] border border-[rgba(21,93,252,0.2)] px-2 py-0.5">
                <Text className="text-monitor-accent-blue text-[11px] font-semibold">
                  {ROLE_LABEL[me?.role ?? ''] ?? me?.role ?? '—'}
                </Text>
              </View>
              {me?.storeName && (
                <Text className="text-monitor-text-dim text-[12px]">{me.storeName}</Text>
              )}
            </View>
          </View>
        </View>

        {/* 프로필 수정 */}
        <SettingsSection title="프로필 수정">
          <Field
            icon="person-outline"
            label="이름"
            value={name}
            onChangeText={setName}
            placeholder="이름 입력"
          />
          <View className="h-px bg-monitor-border mx-4" />
          <Field
            icon="mail-outline"
            label="이메일"
            value={me?.email ?? ''}
            editable={false}
            keyboardType="email-address"
          />
          <View className="h-px bg-monitor-border mx-4" />
          <Field
            icon="storefront-outline"
            label="매장명"
            value={storeName}
            onChangeText={setStoreName}
            placeholder="매장명 입력"
          />
        </SettingsSection>

        {/* 액션 버튼 */}
        <View className="gap-3">
          <Pressable
            onPress={() => mutation.mutate()}
            disabled={!isDirty || mutation.isPending}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary"
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed || !isDirty || mutation.isPending ? 0.5 : 1,
              shadowColor: '#155dfc',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isDirty ? 0.45 : 0,
              shadowRadius: 16,
              elevation: isDirty ? 8 : 0,
            })}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text className="text-[15px] font-semibold text-white">변경 저장</Text>
              </>
            )}
          </Pressable>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-monitor-border" />
            <Text className="text-monitor-text-dim text-[11px]">계정</Text>
            <View className="flex-1 h-px bg-monitor-border" />
          </View>

          <Pressable
            onPress={clearAuth}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)]"
            style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="log-out-outline" size={16} color="#ff6467" />
            <Text className="text-[15px] font-semibold text-event-critical">로그아웃</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}
