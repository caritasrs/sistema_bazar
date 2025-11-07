import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema Cáritas RS - Gestão Solidária",
  description: "Sistema de Gestão Solidária Cáritas RS 3.5 - Bazar Solidário",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.className} font-sans antialiased bg-cover bg-center bg-fixed relative`}
        style={{
          backgroundImage: "url('/red-fabric-bg.png')",
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="fixed inset-0 bg-black/30 pointer-events-none z-0" />

        {/* Content wrapper with z-index to appear above overlay */}
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
