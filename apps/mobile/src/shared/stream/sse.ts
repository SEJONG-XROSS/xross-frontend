import EventSource, { type EventSourceEvent } from 'react-native-sse';
import type { StreamAdapter } from '@xross/core';

export const sseAdapter: StreamAdapter = {
  open({ url, headers, onMessage, onError, onOpen }) {
    const es = new EventSource(url, { headers });

    let closedByClient = false;
    let failed = false;

    // error → close가 연쇄로 발생해도 상위 재연결이 한 번만 동작하도록 가드.
    // 클라이언트가 스스로 닫은 경우(cleanup)는 재연결 대상이 아니다.
    const fail = (error: Error) => {
      if (closedByClient || failed) return;
      failed = true;
      onError(error);
    };

    es.addEventListener('open', () => onOpen?.());

    es.addEventListener('message', (event: EventSourceEvent<'message'>) => {
      if (event.data != null) {
        onMessage({ data: event.data });
      }
    });

    es.addEventListener('error', (event: EventSourceEvent<'error'>) => {
      const msg = (event as unknown as { message?: string }).message ?? 'SSE 연결 오류';
      fail(new Error(msg));
    });

    // 타임아웃 등으로 라이브러리가 연결을 닫는 경우 상위에 알려 재연결시킨다
    es.addEventListener('close', () => fail(new Error('SSE 연결이 종료되었습니다.')));

    return () => {
      closedByClient = true;
      es.close();
    };
  },
};
