'use client'

import { Navigation } from './navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <header className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">
              EigenProtected AVS
            </div>
            <div className="hidden md:block ml-10">
              <Navigation />
            </div>
          </div>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}