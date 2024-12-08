'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTheme } from '@/hooks/use-theme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">EigenLayer AVS</h1>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium">Dashboard</a>
            <a href="/operators" className="text-sm font-medium">Operators</a>
            <a href="/price-feeds" className="text-sm font-medium">Price Feeds</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-accent"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <div className="relative z-[100]">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}