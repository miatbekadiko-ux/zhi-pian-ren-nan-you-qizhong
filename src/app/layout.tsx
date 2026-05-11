import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '纸片人男友',
  description: 'AI 情感陪伴 · Paper Boyfriend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" style={{ height: '100%' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, height: '100%', background: '#0a090a', fontFamily: '"Noto Sans SC", system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
