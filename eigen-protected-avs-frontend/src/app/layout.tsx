import '@rainbow-me/rainbowkit/styles.css'
import '@/app/globals.css'
import { Providers } from '@/components/Providers'
import { MainLayout } from '@/components/Layout/main-layout'

export const metadata = {
  title: 'StakeShield',
  description: 'StakeShield - Protected AVS Platform'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  )
}