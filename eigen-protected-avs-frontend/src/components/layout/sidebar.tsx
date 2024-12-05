'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    href: '/',
    icon: 'GridIcon'
  },
  {
    label: 'Operators',
    href: '/operators',
    icon: 'UsersIcon'
  },
  {
    label: 'Fraud Monitoring',
    href: '/fraud-monitoring',
    icon: 'ShieldExclamationIcon'
  },
  {
    label: 'Price Feeds',
    href: '/price-feeds',
    icon: 'LineChartIcon'
  },
  {
    label: 'Swap Simulation',
    href: '/swap-simulation',
    icon: 'SwapIcon'
  },
  {
    label: 'State Sync',
    href: '/state-sync',
    icon: 'RefreshCwIcon'
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}