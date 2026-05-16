import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@xross/core';

export interface CameraFeed {
  id: string;
  name: string;
  isOnline: boolean;
  isRecording: boolean;
}

export function CameraFeedCard({ camera }: { camera: CameraFeed }) {
  return (
    <View className="flex-1 bg-monitor-card-bg rounded-[10px] overflow-hidden border border-monitor-border">
      <View className="flex-1 items-center justify-center">
        <Ionicons
          name={camera.isOnline ? 'videocam' : 'videocam-off'}
          size={32}
          color={camera.isOnline ? '#51a2ff' : '#62748e'}
        />
        {!camera.isOnline && (
          <Text className="text-[11px] text-monitor-text-dim mt-1.5">오프라인</Text>
        )}
      </View>

      {/* 하단 오버레이 — P9 WebRTCView 교체 후에도 유지 */}
      <View className="absolute bottom-0 left-0 right-0 p-2 flex-row items-center gap-1.5 bg-[rgba(2,6,24,0.7)]">
        <View className={cn('w-[5px] h-[5px] rounded-full', camera.isOnline ? 'bg-monitor-accent-green' : 'bg-monitor-text-dim')} />
        <Text className="text-[11px] text-monitor-text flex-1" numberOfLines={1}>
          {camera.name}
        </Text>
        {camera.isRecording && camera.isOnline && (
          <View className="flex-row items-center gap-[3px]">
            <View className="w-[5px] h-[5px] rounded-full bg-event-critical" />
            <Text className="text-[10px] text-event-critical font-bold">REC</Text>
          </View>
        )}
      </View>
    </View>
  );
}
