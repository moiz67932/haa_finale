import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseProvider from '@/components/providers/supabase-provider'
import QueryProvider from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
title: 'Home & Auto Assistant',
description: 'Track every fix, every mile, every warranty',
    generator: 'v0.dev'
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <SupabaseProvider>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </SupabaseProvider>
    </body>
  </html>
)
}
