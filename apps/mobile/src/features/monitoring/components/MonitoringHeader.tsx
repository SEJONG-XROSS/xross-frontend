import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@xross/tokens";
import { useMe } from "@xross/core";
import { isToday, shiftDay, formatDateLabel } from "@xross/core";
import LogoSvg from "@/assets/images/logo.svg";
import { CalendarPicker } from "./CalendarPicker";
import { useAuthStore } from "@/shared/auth/store";

interface Props {
  date: string;
  onDateChange: (date: string) => void;
}

export function MonitoringHeader({ date, onDateChange }: Props) {
  const insets = useSafeAreaInsets();
  const { data: me } = useMe();
  const today = isToday(date);
  const [calOpen, setCalOpen] = useState(false);

  return (
    <View
      className="bg-monitor-card-bg border-b border-monitor-border"
      style={{
        paddingTop: insets.top,
        height: 56 + insets.top,
      }}
    >
      <View className="flex-1 flex-row items-center px-4">
        {/* 좌측: 로고 아이콘만 */}
        <View className="flex-1">
          <Pressable
            onPress={() => {
              console.log("logout");
              useAuthStore.getState().clearAuth();
            }}
          >
            <LogoSvg width={28} height={28} />
          </Pressable>
        </View>

        {/* 중앙: 날짜 내비게이션 */}
        <View className="flex-row items-center gap-0.5">
          <Pressable
            onPress={() => onDateChange(shiftDay(date, -1))}
            className="w-8 h-8 items-center justify-center rounded-md"
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={colors.monitor["text-dim"]}
            />
          </Pressable>

          {/* 날짜 탭 → 캘린더 오픈 */}
          <Pressable
            onPress={() => setCalOpen(true)}
            className="items-center px-1.5 py-1"
          >
            {today && (
              <View className="bg-monitor-accent-blue/10 rounded-lg px-1.5 py-[1px] mb-0.5">
                <Text className="text-10 font-bold text-monitor-accent-blue">
                  오늘
                </Text>
              </View>
            )}
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="calendar-outline"
                size={12}
                color={colors.monitor["text-dim"]}
              />
              <Text className="text-13 font-semibold text-monitor-text">
                {formatDateLabel(date)}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => !today && onDateChange(shiftDay(date, 1))}
            className="w-8 h-8 items-center justify-center rounded-md"
            style={{ opacity: today ? 0.3 : 1 }}
            disabled={today}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.monitor["text-dim"]}
            />
          </Pressable>
        </View>

        <CalendarPicker
          visible={calOpen}
          selected={date}
          onSelect={onDateChange}
          onClose={() => setCalOpen(false)}
        />

        {/* 우측: 매장 정보 */}
        <View className="flex-1 items-end">
          {me?.name && (
            <Text
              className="text-11 font-medium text-monitor-text"
              numberOfLines={1}
            >
              {me.name}
            </Text>
          )}
          <Text className="text-10 text-monitor-text-dim" numberOfLines={1}>
            {me?.storeName ?? "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}
