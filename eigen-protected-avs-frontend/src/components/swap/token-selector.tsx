'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export interface Token {
  symbol: string
  address: string
  decimals: number
  logoURI?: string
}

const SUPPORTED_TOKENS: Token[] = [
  { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
]

interface TokenSelectorProps {
  value: Token | null
  onChange: (token: Token) => void
  label: string
  disabled?: boolean
}

export function TokenSelector({ value, onChange, label, disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        disabled={disabled}
      >
        {value ? value.symbol : 'Select token'}
        <span className="ml-2">▼</span>
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {SUPPORTED_TOKENS.map((token) => (
            <button
              key={token.address}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                onChange(token)
                setIsOpen(false)
              }}
            >
              <div className="flex items-center">
                {token.logoURI && (
                  <img 
                    src={token.logoURI} 
                    alt={token.symbol}
                    className="w-5 h-5 mr-2"
                  />
                )}
                {token.symbol}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 