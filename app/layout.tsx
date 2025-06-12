import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import I18nProvider from "@/components/i18n-provider"
import "./globals.css"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RAG Explorer by Respeak",
  description: "An interactive guide to understanding Retrieval Augmented Generation, powered by Respeak",
  generator: 'Respeak',
  icons: {
    icon: '/Respeak_fav.png',
    shortcut: '/Respeak_fav.png',
    apple: '/Respeak_fav.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
