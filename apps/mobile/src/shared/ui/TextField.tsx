import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  password?: boolean;
  emailVariant?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, password = false, emailVariant = false, ...props }, ref) => {
    const [secure, setSecure] = useState(password);

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
            {...props}
          />
          {password && (
            <Pressable onPress={() => setSecure((v) => !v)} hitSlop={12}>
              <Text className="text-input-icon text-xs ml-2">
                {secure ? '보기' : '숨기기'}
              </Text>
            </Pressable>
          )}
        </View>
        {error && <Text className="text-event-critical text-xs">{error}</Text>}
      </View>
    );
  },
);
