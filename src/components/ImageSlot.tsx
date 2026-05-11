'use client';

import React from 'react';

interface ImageSlotProps {
  id?: string;
  shape?: string;
  fit?: string;
  placeholder?: string;
  position?: string;
  style?: React.CSSProperties;
}

export function ImageSlot({ style }: ImageSlotProps) {
  return <div style={style} />;
}
