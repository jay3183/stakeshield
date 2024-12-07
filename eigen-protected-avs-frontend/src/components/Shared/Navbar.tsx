'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTheme } from '@/hooks/use-theme'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">EigenLayer AVS</h1>
          <div className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium">Dashboard</a>
            <a href="/operators" className="text-sm font-medium">Operators</a>
            <a href="/admin" className="text-sm font-medium">Admin</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-accent"
          >
            {theme === 'dark' ? '��' : '🌙'}
          </button>
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
} 