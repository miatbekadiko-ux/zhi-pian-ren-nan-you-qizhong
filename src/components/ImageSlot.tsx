'use client';

import React from 'react';
import { characters } from '@/lib/characters';

interface ImageSlotProps {
  id?: string;
  shape?: string;
  fit?: string;
  placeholder?: string;
  position?: string;
  style?: React.CSSProperties;
}

export function ImageSlot({ id, style }: ImageSlotProps) {
  // Check if this is a hero image for a character
  if (id && id.startsWith('hero-')) {
    const characterId = id.replace('hero-', '');
    const character = characters.find(c => c.id === characterId);

    if (character?.portraitUrl) {
      return (
        <img
          src={character.portraitUrl}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...style,
          }}
        />
      );
    }
  }

  // Fallback to original empty div for other cases
  return <div style={style} />;
}
