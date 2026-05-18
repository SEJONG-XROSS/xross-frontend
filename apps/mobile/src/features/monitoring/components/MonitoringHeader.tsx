import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
      style={{
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingTop: insets.top,
        height: 56 + insets.top,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        {/* 좌측: 로고 아이콘만 */}
        <View style={{ flex: 1 }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Pressable
            onPress={() => onDateChange(shiftDay(date, -1))}
            style={{
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
          >
            <Ionicons name="chevron-back" size={16} color="#64748b" />
          </Pressable>

          {/* 날짜 탭 → 캘린더 오픈 */}
          <Pressable
            onPress={() => setCalOpen(true)}
            style={{
              alignItems: "center",
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
          >
            {today && (
              <View
                style={{
                  backgroundColor: "rgba(21,93,252,0.1)",
                  borderRadius: 8,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  marginBottom: 2,
                }}
              >
                <Text
                  style={{ fontSize: 9, fontWeight: "700", color: "#155dfc" }}
                >
                  오늘
                </Text>
              </View>
            )}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="calendar-outline" size={12} color="#64748b" />
              <Text
                style={{ fontSize: 13, fontWeight: "600", color: "#0f172a" }}
              >
                {formatDateLabel(date)}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => !today && onDateChange(shiftDay(date, 1))}
            style={{
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              opacity: today ? 0.3 : 1,
            }}
            disabled={today}
          >
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </Pressable>
        </View>

        <CalendarPicker
          visible={calOpen}
          selected={date}
          onSelect={onDateChange}
          onClose={() => setCalOpen(false)}
        />

        {/* 우측: 매장 정보 */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {me?.name && (
            <Text
              style={{ fontSize: 11, fontWeight: "500", color: "#0f172a" }}
              numberOfLines={1}
            >
              {me.name}
            </Text>
          )}
          <Text style={{ fontSize: 10, color: "#64748b" }} numberOfLines={1}>
            {me?.storeName ?? "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}
