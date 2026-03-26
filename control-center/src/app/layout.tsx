import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexus Control Center',
  description:
    'Inspect Nexus Copilot sessions, audit events, agent flow, and debug telemetry.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
