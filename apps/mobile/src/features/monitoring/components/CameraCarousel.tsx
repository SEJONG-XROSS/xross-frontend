import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, useWindowDimensions } from 'react-native';
import type { CameraFeed } from './CameraFeedCard';
import { CameraFeedCard } from './CameraFeedCard';

interface Props {
  cameras: CameraFeed[];
}

export function CameraCarousel({ cameras }: Props) {
  const { width } = useWindowDimensions();
  const [idx, setIdx] = useState(0);
  const listRef = useRef<FlatList>(null);
  const count = cameras.length;

  if (count === 0) return null;

  const CARD_HEIGHT = 220;

  return (
    <View style={{ height: CARD_HEIGHT + 40, backgroundColor: '#0f172b' }}>
      {/* 카메라 FlatList */}
      <FlatList
        ref={listRef}
        data={cameras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width, height: CARD_HEIGHT, padding: 10 }}>
            <CameraFeedCard camera={item} />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          setIdx(newIdx);
        }}
        style={{ height: CARD_HEIGHT }}
      />

      {/* 컨트롤 바 */}
      {count > 1 && (
        <View style={{
          height: 40, flexDirection: 'row', alignItems: 'center',
          justifyContent: 'center', gap: 12,
          backgroundColor: '#0f172b',
        }}>
          {/* 이전 */}
          <Pressable
            onPress={() => {
              const newIdx = Math.max(0, idx - 1);
              listRef.current?.scrollToIndex({ index: newIdx, animated: true });
              setIdx(newIdx);
            }}
            disabled={idx === 0}
            style={{
              width: 28, height: 28, borderRadius: 6,
              borderWidth: 1, borderColor: '#1d293d',
              alignItems: 'center', justifyContent: 'center',
              opacity: idx === 0 ? 0.3 : 1,
            }}
          >
            <Text style={{ color: '#90a1b9', fontSize: 16 }}>‹</Text>
          </Pressable>

          {/* 도트 인디케이터 */}
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            {cameras.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  listRef.current?.scrollToIndex({ index: i, animated: true });
                  setIdx(i);
                }}
                style={{
                  height: 6,
                  width: i === idx ? 18 : 6,
                  borderRadius: 3,
                  backgroundColor: i === idx ? '#51a2ff' : '#314158',
                }}
              />
            ))}
          </View>

          {/* 다음 */}
          <Pressable
            onPress={() => {
              const newIdx = Math.min(count - 1, idx + 1);
              listRef.current?.scrollToIndex({ index: newIdx, animated: true });
              setIdx(newIdx);
            }}
            disabled={idx === count - 1}
            style={{
              width: 28, height: 28, borderRadius: 6,
              borderWidth: 1, borderColor: '#1d293d',
              alignItems: 'center', justifyContent: 'center',
              opacity: idx === count - 1 ? 0.3 : 1,
            }}
          >
            <Text style={{ color: '#90a1b9', fontSize: 16 }}>›</Text>
          </Pressable>

          <Text style={{ fontSize: 11, color: '#62748e', fontFamily: 'monospace', marginLeft: 4 }}>
            {idx + 1}/{count}
          </Text>
        </View>
      )}
    </View>
  );
}
