'use client'

import { useTheme } from '@/providers/theme-provider'

export function ThemeTest() {
  const { theme } = useTheme()
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-black text-black dark:text-white rounded shadow">
      Current theme: {theme}
    </div>
  )
} 