import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { cn } from "@xross/core";
import type { CameraFeed } from "./CameraFeedCard";
import { CameraFeedCard } from "./CameraFeedCard";

export function CameraCarousel({ cameras }: { cameras: CameraFeed[] }) {
  const { width } = useWindowDimensions();
  const [idx, setIdx] = useState(0);
  const listRef = useRef<FlatList>(null);
  const count = cameras.length;

  if (count === 0) return null;

  const CARD_HEIGHT = 220;

  return (
    <View className="bg-monitor-bg" style={{ height: CARD_HEIGHT + 40 }}>
      {/* width는 런타임 값 → style 유지 */}
      <FlatList
        ref={listRef}
        data={cameras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: CameraFeed }) => (
          <View style={{ width, height: CARD_HEIGHT, padding: 10 }}>
            <CameraFeedCard camera={item} />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setIdx(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        style={{ height: CARD_HEIGHT }}
      />

      {count > 1 && (
        <View className="h-10 flex-row items-center justify-center gap-3 bg-monitor-bg">
          <Pressable
            onPress={() => {
              const n = Math.max(0, idx - 1);
              listRef.current?.scrollToIndex({ index: n, animated: true });
              setIdx(n);
            }}
            disabled={idx === 0}
            className={cn(
              "h-7 w-7 items-center justify-center rounded-md border border-monitor-border",
              idx === 0 && "opacity-30",
            )}
          >
            <Text className="text-base text-monitor-text-muted">‹</Text>
          </Pressable>

          <View className="flex-row items-center gap-[5px]">
            {cameras.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  listRef.current?.scrollToIndex({ index: i, animated: true });
                  setIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full",
                  i === idx
                    ? "w-[18px] bg-monitor-accent-blue"
                    : "w-1.5 bg-monitor-border-strong",
                )}
              />
            ))}
          </View>

          <Pressable
            onPress={() => {
              const n = Math.min(count - 1, idx + 1);
              listRef.current?.scrollToIndex({ index: n, animated: true });
              setIdx(n);
            }}
            disabled={idx === count - 1}
            className={cn(
              "h-7 w-7 items-center justify-center rounded-md border border-monitor-border",
              idx === count - 1 && "opacity-30",
            )}
          >
            <Text className="text-base text-monitor-text-muted">›</Text>
          </Pressable>

          <Text className="ml-1 font-mono text-[11px] text-monitor-text-dim">
            {idx + 1}/{count}
          </Text>
        </View>
      )}
    </View>
  );
}
