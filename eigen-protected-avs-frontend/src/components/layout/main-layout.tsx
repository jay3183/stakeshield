'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Layout/sidebar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          {isSidebarOpen ? (
            <span className="h-6 w-6">✕</span>
          ) : (
            <span className="h-6 w-6">☰</span>
          )}
        </button>

        <Sidebar 
          isCollapsed={!isSidebarOpen && !isMobile} 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
        />
        
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block fixed top-4 left-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            {isSidebarOpen ? (
              <span className="h-5 w-5">✕</span>
            ) : (
              <span className="h-5 w-5">☰</span>
            )}
          </button>
          
          <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            {children}
          </main>
        </div>

        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}