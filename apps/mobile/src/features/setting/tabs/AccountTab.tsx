import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMe, updateProfileApi, authQueryKeys, cn } from '@xross/core';
import { colors } from '@xross/tokens';
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
      style={{ shadowColor: colors.brand.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16 }}
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
        <Ionicons name={icon} size={11} color={colors.monitor['text-dim']} />
        <Text className="text-monitor-text-dim text-11 font-medium uppercase tracking-wider">
          {label}
        </Text>
      </View>
      <TextInput
        className={cn('text-monitor-text text-14 py-0', !editable && 'opacity-50')}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.monitor['text-dim']}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const newPwRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    setError('');
    if (!currentPw) { setError('현재 비밀번호를 입력하세요.'); return; }
    if (newPw.length < 6) { setError('새 비밀번호는 6자 이상이어야 합니다.'); return; }
    if (newPw !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    try {
      await updateProfileApi({ currentPassword: currentPw, newPassword: newPw });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch {
      setError('비밀번호 변경 실패. 현재 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/60"
          onPress={onClose}
        >
          <Pressable
            className="bg-monitor-card-bg border border-monitor-border w-[320px] rounded-2xl p-5"
            onPress={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <View className="flex-row items-center gap-3 mb-5">
              <View className="w-9 h-9 rounded-xl bg-[rgba(21,93,252,0.12)] border border-[rgba(21,93,252,0.2)] items-center justify-center">
                <Ionicons name="key-outline" size={16} color={colors.brand.primary} />
              </View>
              <View>
                <Text className="text-monitor-text text-14 font-bold">비밀번호 변경</Text>
                <Text className="text-monitor-text-dim text-12">새 비밀번호를 입력하세요</Text>
              </View>
            </View>

            {success ? (
              <View className="items-center gap-2 py-4">
                <View className="w-10 h-10 rounded-full bg-[rgba(0,212,146,0.12)] items-center justify-center">
                  <Ionicons name="checkmark" size={20} color={colors.monitor['accent-green']} />
                </View>
                <Text className="text-monitor-text text-14 font-medium">변경 완료</Text>
              </View>
            ) : (
              <View className="gap-3">
                <View className="gap-1.5">
                  <Text className="text-monitor-text-dim text-11 font-medium uppercase tracking-wider">현재 비밀번호</Text>
                  <TextInput
                    className="bg-monitor-bg border border-monitor-border h-10 rounded-xl px-3 text-14 text-monitor-text"
                    value={currentPw}
                    onChangeText={setCurrentPw}
                    placeholder="현재 비밀번호 입력"
                    placeholderTextColor={colors.monitor['text-dim']}
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => newPwRef.current?.focus()}
                  />
                </View>
                <View className="gap-1.5">
                  <Text className="text-monitor-text-dim text-11 font-medium uppercase tracking-wider">새 비밀번호</Text>
                  <TextInput
                    ref={newPwRef}
                    className="bg-monitor-bg border border-monitor-border h-10 rounded-xl px-3 text-14 text-monitor-text"
                    value={newPw}
                    onChangeText={setNewPw}
                    placeholder="6자 이상"
                    placeholderTextColor={colors.monitor['text-dim']}
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => confirmRef.current?.focus()}
                  />
                </View>
                <View className="gap-1.5">
                  <Text className="text-monitor-text-dim text-11 font-medium uppercase tracking-wider">비밀번호 확인</Text>
                  <TextInput
                    ref={confirmRef}
                    className="bg-monitor-bg border border-monitor-border h-10 rounded-xl px-3 text-14 text-monitor-text"
                    value={confirmPw}
                    onChangeText={setConfirmPw}
                    placeholder="동일하게 입력"
                    placeholderTextColor={colors.monitor['text-dim']}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {error ? <Text className="text-event-critical text-12">{error}</Text> : null}

                <View className="flex-row gap-2 mt-1">
                  <Pressable
                    onPress={onClose}
                    className="flex-1 h-10 items-center justify-center rounded-xl border border-monitor-border"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-monitor-text-dim text-13">취소</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    className="flex-1 h-10 items-center justify-center rounded-xl bg-brand-primary"
                    style={({ pressed }) => ({ opacity: pressed || loading ? 0.6 : 1 })}
                  >
                    {loading
                      ? <ActivityIndicator color={colors.brand['on-primary']} size="small" />
                      : <Text className="text-white text-13 font-semibold">변경</Text>
                    }
                  </Pressable>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function AccountTab() {
  const { data: me } = useMe();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  const [name, setName] = useState(() => me?.name ?? '');
  const [storeName, setStoreName] = useState(() => me?.storeName ?? '');
  const [pwModalOpen, setPwModalOpen] = useState(false);

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
      {pwModalOpen && <PasswordModal onClose={() => setPwModalOpen(false)} />}
      <View className="px-4 py-6 gap-6">

        {/* 프로필 헤더 */}
        <View className="items-center gap-3">
          <ProfileAvatar name={me?.name ?? ''} />
          <View className="items-center gap-1">
            <Text className="text-monitor-text text-lg font-bold">
              {me?.name ?? '—'}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="rounded-badge bg-[rgba(21,93,252,0.12)] border border-[rgba(21,93,252,0.2)] px-2 py-0.5">
                <Text className="text-monitor-accent-blue text-11 font-semibold">
                  {ROLE_LABEL[me?.role ?? ''] ?? me?.role ?? '—'}
                </Text>
              </View>
              {me?.storeName && (
                <Text className="text-monitor-text-dim text-12">{me.storeName}</Text>
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

        {/* 보안 */}
        <SettingsSection title="보안">
          <Pressable
            onPress={() => setPwModalOpen(true)}
            className="flex-row items-center justify-between px-4 py-3.5"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="key-outline" size={15} color={colors.monitor['text-dim']} />
              <Text className="text-monitor-text text-14">비밀번호 변경</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.monitor['text-dim']} />
          </Pressable>
        </SettingsSection>

        {/* 액션 버튼 */}
        <View className="gap-3">
          <Pressable
            onPress={() => mutation.mutate()}
            disabled={!isDirty || mutation.isPending}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-brand-primary"
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed || !isDirty || mutation.isPending ? 0.5 : 1,
              shadowColor: colors.brand.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isDirty ? 0.45 : 0,
              shadowRadius: 16,
              elevation: isDirty ? 8 : 0,
            })}
          >
            {mutation.isPending ? (
              <ActivityIndicator color={colors.brand['on-primary']} size="small" />
            ) : (
              <>
                <Ionicons name="save-outline" size={16} color={colors.brand['on-primary']} />
                <Text className="text-14 font-semibold text-white">변경 저장</Text>
              </>
            )}
          </Pressable>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-monitor-border" />
            <Text className="text-monitor-text-dim text-11">계정</Text>
            <View className="flex-1 h-px bg-monitor-border" />
          </View>

          <Pressable
            onPress={clearAuth}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)]"
            style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="log-out-outline" size={16} color={colors.event.critical} />
            <Text className="text-14 font-semibold text-event-critical">로그아웃</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}
