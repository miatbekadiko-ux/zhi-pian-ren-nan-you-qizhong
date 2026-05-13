'use client';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = 'currentColor' }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'home': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M10.707 2.293a1 1 0 0 1 1.414 0l7.293 7.293A1 1 0 0 1 19 11h-1v9a1 1 0 0 1-1 1h-4v-5h-2v5H7a1 1 0 0 1-1-1v-9H5a1 1 0 0 1-.707-1.707l6.414-6.414z"/></svg>;
    case 'chat': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7l-5 4V4z"/></svg>;
    case 'user': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 8a7 7 0 0 1 14 0H5z"/></svg>;
    case 'gear': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.94-2.06a7.07 7.07 0 0 0 .06-.94c0-.32-.03-.64-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.63l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 15 3h-3.84a.48.48 0 0 0-.48.41l-.36 2.54a7 7 0 0 0-1.62.94l-2.39-.96a.49.49 0 0 0-.61.22L3.78 9.47a.48.48 0 0 0 .12.63l2.03 1.58c-.04.3-.06.63-.06.94s.02.64.06.94L3.9 15.14a.48.48 0 0 0-.12.63l1.92 3.32c.12.22.38.3.61.22l2.39-.96c.5.36 1.04.67 1.62.94l.36 2.54c.06.24.27.41.48.41H15a.48.48 0 0 0 .48-.41l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96c.23.08.49 0 .61-.22l1.92-3.32a.48.48 0 0 0-.12-.63l-2.03-1.58z"/></svg>;
    case 'send': return <svg {...common}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'play': return <svg viewBox="0 0 24 24" width={size} height={size} fill={color} stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>;
    case 'eye': return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'cal': return <svg {...common}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'cam': return <svg {...common}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'globe': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'bell': return <svg {...common}><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 3h16z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'volume': return <svg {...common}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>;
    case 'trash': return <svg {...common}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>;
    case 'logout': return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'arrow': return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case 'save': return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>;
    case 'lock': return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>;
    case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'gem': return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <path d="M5.5 3h13l3.5 5-10 13L2 8l3.5-5zM7 4l-2.7 4H9L7 4zm10 0l-2 4h4.7L17 4zm-5 0l-2 4h4l-2-4zM4.7 9l5.5 8.5L8.4 9H4.7zm5.7 0l1.6 9.5L13.6 9h-3.2zm5.2 0l-1.8 8.5L19.3 9h-3.7z"/>
      </svg>
    );
    case 'diamond': return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ transform: 'rotate(60deg)' }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
    default: return null;
  }
}
