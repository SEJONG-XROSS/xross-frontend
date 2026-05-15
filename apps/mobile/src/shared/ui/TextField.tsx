import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  password?: boolean;
  emailVariant?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, password = false, emailVariant = false, value, onChangeText, ...props }, ref) => {
    const [secure, setSecure] = useState(password);
    const hasValue = (value?.length ?? 0) > 0;

    const borderClass = error
      ? 'border-event-critical'
      : emailVariant
        ? 'border-input-border-email'
        : 'border-input-border';

    return (
      <View className="gap-1.5">
        {label && (
          <Text className="text-label text-xs font-medium uppercase tracking-wider">
            {label}
          </Text>
        )}
        <View className={`flex-row items-center h-11 px-4 rounded-[10px] border bg-surface-elevated ${borderClass}`}>
          <TextInput
            ref={ref}
            className="flex-1 text-heading text-sm tracking-tight"
            placeholderTextColor="#94a3b8"
            secureTextEntry={secure}
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onChangeText={onChangeText}
            {...props}
          />

          <View className="flex-row items-center gap-1 ml-1">
            {/* clear 버튼 — 값 있을 때 표시 */}
            {hasValue && (
              <Pressable
                onPress={() => onChangeText?.('')}
                hitSlop={8}
                className="p-1"
              >
                <Ionicons name="close-circle" size={16} color="#94a3b8" />
              </Pressable>
            )}

            {/* 비밀번호 보기/숨기기 토글 */}
            {password && (
              <Pressable
                onPress={() => setSecure((v) => !v)}
                hitSlop={8}
                className="p-1"
              >
                <Ionicons
                  name={secure ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#94a3b8"
                />
              </Pressable>
            )}
          </View>
        </View>
        {error && <Text className="text-event-critical text-xs">{error}</Text>}
      </View>
    );
  },
);
