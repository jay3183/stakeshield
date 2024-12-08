'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import type { LucideIcon } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  isMobile: boolean
  isOpen: boolean
}

interface NavItem {
  name: string
  href: string
  Icon: any // We'll use type assertion when using the icon
}

export function Sidebar({ isCollapsed, isMobile, isOpen }: SidebarProps) {
  const pathname = usePathname()

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', Icon: HomeIcon },
    { name: 'Operators', href: '/operators', Icon: UserGroupIcon },
    { name: 'Price Feeds', href: '/price-feeds', Icon: CurrencyDollarIcon },
    { name: 'State Sync', href: '/state-sync', Icon: ArrowPathIcon },
  ] as const

  if (isMobile && !isOpen) return null

  return (
    <aside className={`
      flex h-screen flex-col fixed left-0 top-0 z-40
      border-r border-gray-200 dark:border-gray-800 
      bg-white/10 backdrop-blur-lg transition-all duration-300
      ${isMobile 
        ? 'w-64' 
        : isCollapsed ? 'w-16' : 'w-64'
      }
      ${isMobile ? 'shadow-lg' : ''}
    `}>
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <span className={`font-bold text-xl transition-all duration-300 ${
          isCollapsed && !isMobile ? 'scale-0' : 'scale-100'
        }`}>
          StakeShield
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.Icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm transition-all
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${isActive 
                  ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className={`transition-all duration-300 ${
                isCollapsed && !isMobile ? 'opacity-0 w-0' : 'opacity-100'
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}