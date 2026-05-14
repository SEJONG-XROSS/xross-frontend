import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  password?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, password = false, ...props }, ref) => {
    const [secure, setSecure] = useState(password);

    return (
      <View className="gap-1.5">
        {label && (
          <Text className="text-monitor-text-muted text-sm font-medium">{label}</Text>
        )}
        <View
          className={[
            'flex-row items-center h-12 px-4 rounded-xl border bg-monitor-card-bg',
            error ? 'border-event-critical' : 'border-monitor-border',
          ].join(' ')}
        >
          <TextInput
            ref={ref}
            className="flex-1 text-monitor-text text-sm"
            placeholderTextColor="#62748e"
            secureTextEntry={secure}
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
          />
          {password && (
            <Pressable onPress={() => setSecure((v) => !v)} hitSlop={12}>
              <Text className="text-monitor-text-dim text-xs ml-2">
                {secure ? '보기' : '숨기기'}
              </Text>
            </Pressable>
          )}
        </View>
        {error && (
          <Text className="text-event-critical text-xs">{error}</Text>
        )}
      </View>
    );
  },
);
