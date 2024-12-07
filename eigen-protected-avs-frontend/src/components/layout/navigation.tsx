'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Operators', href: '/operators' },
  { name: 'Swap Simulation', href: '/swap-simulation' },
  { name: 'Price Feeds', href: '/price-feeds' },
  { name: 'State Sync', href: '/state-sync' }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname === item.href
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
} 