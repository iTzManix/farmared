import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Farmared - Sistema de Red de Farmacias',
  description: 'Sistema distribuido para gestión de farmacias en Bolivia, Perú y Chile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-[100vh] bg-background">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}