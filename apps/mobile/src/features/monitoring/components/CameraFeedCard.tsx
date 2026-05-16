import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CameraFeed {
  id: string;
  name: string;
  isOnline: boolean;
  isRecording: boolean;
}

interface Props {
  camera: CameraFeed;
}

export function CameraFeedCard({ camera }: Props) {
  return (
    <View style={{
      flex: 1, backgroundColor: '#020618',
      borderRadius: 10, overflow: 'hidden',
      borderWidth: 1, borderColor: '#1d293d',
    }}>
      {/* 영상 영역 — P9에서 WebRTCView로 교체 */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          name={camera.isOnline ? 'videocam' : 'videocam-off'}
          size={32}
          color={camera.isOnline ? '#51a2ff' : '#62748e'}
        />
        {!camera.isOnline && (
          <Text style={{ fontSize: 11, color: '#62748e', marginTop: 6 }}>
            오프라인
          </Text>
        )}
      </View>

      {/* 하단 오버레이 */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(2,6,24,0.7)',
      }}>
        <View style={{
          width: 5, height: 5, borderRadius: 3,
          backgroundColor: camera.isOnline ? '#00d492' : '#62748e',
        }} />
        <Text style={{ fontSize: 11, color: '#e2e8f0', flex: 1 }} numberOfLines={1}>
          {camera.name}
        </Text>
        {camera.isRecording && camera.isOnline && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#ff6467' }} />
            <Text style={{ fontSize: 10, color: '#ff6467', fontWeight: '700' }}>REC</Text>
          </View>
        )}
      </View>
    </View>
  );
}
