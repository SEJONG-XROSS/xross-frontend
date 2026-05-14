import EventSource, { type EventSourceEvent } from 'react-native-sse';
import type { StreamAdapter } from '@xross/core';

export const sseAdapter: StreamAdapter = {
  open({ url, headers, onMessage, onError, onOpen }) {
    const es = new EventSource(url, { headers });

    es.addEventListener('open', () => onOpen?.());

    es.addEventListener('message', (event: EventSourceEvent<'message'>) => {
      if (event.data != null) {
        onMessage({ data: event.data });
      }
    });

    es.addEventListener('error', (event: EventSourceEvent<'error'>) => {
      const msg = (event as unknown as { message?: string }).message ?? 'SSE 연결 오류';
      onError(new Error(msg));
    });

    return () => es.close();
  },
};
