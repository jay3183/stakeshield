'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <nav className="mt-8 space-y-4">
                <a href="#" className="block hover:text-blue-500">Dashboard</a>
                <a href="#" className="block hover:text-blue-500">Operators</a>
                <a href="#" className="block hover:text-blue-500">Settings</a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 