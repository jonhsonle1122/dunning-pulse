import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DunningPulse — Lightweight Stripe Involuntary Churn Recovery',
  description: 'Recover failed subscription payments for your Micro-SaaS with branded dunning emails and in-app alert banners. $19/mo flat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

