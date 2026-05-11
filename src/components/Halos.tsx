'use client';

import { T } from '@/lib/tokens';

interface HalosProps {
  opacity?: number;
}

export function Halos({ opacity = 0.18 }: HalosProps) {
  return (
    <>
      <div style={{ position: 'absolute', top: -180, left: -160, width: 480, height: 480, borderRadius: '50%', background: T.pink, filter: 'blur(140px)', opacity, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -140, width: 460, height: 460, borderRadius: '50%', background: '#7C3D9C', filter: 'blur(140px)', opacity: opacity * 0.7, pointerEvents: 'none' }} />
    </>
  );
}
