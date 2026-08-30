import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '廖海桥 | 剪辑师 / 导演',
  description: '廖海桥的剪辑与导演作品集。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
