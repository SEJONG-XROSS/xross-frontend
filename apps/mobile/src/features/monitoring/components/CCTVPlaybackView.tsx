import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  alertId: number;
  cameraName: string;
}

export function CCTVPlaybackView({ alertId, cameraName }: Props) {
  const [hasError, setHasError] = useState(false);
  const { width } = useWindowDimensions();
  const videoHeight = Math.round(width * (9 / 16));
  const apiBase = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  const uri = `${apiBase}/videos/stream/${alertId}`;

  const player = useVideoPlayer({ uri }, (p) => {
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener('statusChange', ({ status }) => {
      if (status === 'error') setHasError(true);
    });
    return () => sub.remove();
  }, [player]);

  if (hasError) {
    return (
      <View className="bg-black items-center justify-center gap-2" style={{ height: videoHeight }}>
        <Ionicons name="videocam-off-outline" size={36} color="#62748e" />
        <Text className="text-monitor-text-dim text-xs font-mono">영상 없음</Text>
      </View>
    );
  }

  return (
    <View className="bg-black" style={{ height: videoHeight }}>
      <VideoView
        player={player}
        style={{ flex: 1 }}
        nativeControls
        contentFit="contain"
        allowsFullscreen
      />

      {/* 상단 오버레이 */}
      <View
        className="absolute inset-x-0 top-0 flex-row items-start justify-between px-4 pt-3 pb-8"
        pointerEvents="none"
      >
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-monitor-accent-blue" />
          <Text className="text-[13px] font-bold tracking-wide text-white"
            style={{ textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
            {cameraName}
          </Text>
        </View>
        <View className="rounded-sm border border-[rgba(43,127,255,0.3)] bg-[rgba(43,127,255,0.2)] px-2 py-0.5">
          <Text className="text-monitor-accent-blue font-mono text-[10px] tracking-widest">복기</Text>
        </View>
      </View>
    </View>
  );
}
