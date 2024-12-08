import '@rainbow-me/rainbowkit/styles.css'
import '@/app/globals.css'
import { Providers } from '@/components/Providers'
import { MainLayout } from '@/components/Layout/main-layout'

export const metadata = {
  title: 'Eigen Protected AVS',
  description: 'Eigen Protected AVS Frontend',
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