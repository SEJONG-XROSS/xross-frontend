import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@xross/tokens';
import {
  RTCPeerConnection,
  RTCView,
  MediaStream,
} from 'react-native-webrtc';
import type RTCTrackEvent from 'react-native-webrtc/lib/typescript/RTCTrackEvent';

interface Props {
  /** MediaMTX 스트림 경로 (예: "camera1") */
  streamPath: string;
  /** MediaMTX base URL (예: "http://192.168.1.1:8889") */
  baseUrl: string;
}

export function WebRTCView({ streamPath, baseUrl }: Props) {
  const [streamURL, setStreamURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      const whepUrl = `${baseUrl}/${streamPath}/whep`;

      try {
        // 1) OPTIONS → ICE 서버 파싱
        const optRes = await fetch(whepUrl, { method: 'OPTIONS' });
        const linkHeader = optRes.headers.get('Link') ?? '';
        const iceServers: { urls: string }[] = [];
        for (const match of linkHeader.matchAll(/<([^>]+)>;\s*rel="ice-server"/g)) {
          iceServers.push({ urls: match[1] });
        }

        // 2) RTCPeerConnection 생성
        const pc = new RTCPeerConnection({ iceServers });
        pcRef.current = pc;

        // 3) recvonly 트랜시버
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });

        // 4) 원격 트랙 수신 → MediaStream URL
        const remoteStream = new MediaStream();
        pc.addEventListener('track', (event: RTCTrackEvent<'track'>) => {
          if (event.track) {
            remoteStream.addTrack(event.track);
            if (mounted) {
              setStreamURL(remoteStream.toURL());
              setLoading(false);
            }
          }
        });

        // 5) Offer → POST → Answer
        const offer = await pc.createOffer({});
        await pc.setLocalDescription(offer);

        const postRes = await fetch(whepUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });

        if (!postRes.ok) {
          const body = await postRes.text();
          throw new Error(`WHEP failed: ${postRes.status} — ${body}`);
        }

        const answerSdp = await postRes.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '스트림 연결 실패');
          setLoading(false);
        }
      }
    };

    connect();

    return () => {
      mounted = false;
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, [streamPath, baseUrl]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-monitor-card-bg gap-2">
        <ActivityIndicator color={colors.monitor['accent-blue']} size="small" />
        <Text className="text-11 text-monitor-text-dim font-mono">
          스트림 연결 중...
        </Text>
      </View>
    );
  }

  if (error || !streamURL) {
    return (
      <View className="flex-1 items-center justify-center bg-monitor-card-bg gap-3 px-6">
        <View
          className="w-12 h-12 rounded-full items-center justify-center bg-event-critical/[0.08] border border-event-critical/20"
        >
          <Ionicons name="videocam-off-outline" size={22} color={colors.event.critical} />
        </View>
        <View className="items-center gap-1">
          <Text className="text-13 font-semibold text-event-critical text-center">스트림 연결 실패</Text>
          <Text className="text-11 text-monitor-text-dim text-center">카메라가 오프라인이거나{'\n'}스트림을 사용할 수 없습니다</Text>
        </View>
      </View>
    );
  }

  return (
    <RTCView
      streamURL={streamURL}
      style={{ flex: 1, backgroundColor: '#000' }}
      objectFit="contain"
      mirror={false}
    />
  );
}
