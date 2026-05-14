import React from 'react';
import { setStreamAdapter } from '@xross/core';
// axios client 초기화 side-effect import
import '@/shared/api/client';
import { sseAdapter } from '@/shared/stream/sse';

setStreamAdapter(sseAdapter);

export function AdaptersProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
