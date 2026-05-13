import React from 'react';
// axios client 초기화 side-effect import
import '@/shared/api/client';

export function AdaptersProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
