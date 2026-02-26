import type { Metadata, Viewport } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const _jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: 'Calculadora de Pedidos',
  description: 'Calculadora de pedidos para vendedores de cerveza',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pedidos',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'oklch(0.22 0 0)',
              color: 'oklch(0.95 0 0)',
              border: '1px solid oklch(0.28 0 0)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
