'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '@/hooks/use-notifications'

export function Notifications() {
  const { notifications, remove } = useNotifications()

  // Auto remove after 5 seconds
  useEffect(() => {
    const timeouts = notifications.map((notification) => {
      return setTimeout(() => remove(notification.id), 5000)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [notifications, remove])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-2 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-50 text-green-900' :
              notification.type === 'error' ? 'bg-red-50 text-red-900' :
              'bg-blue-50 text-blue-900'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => remove(notification.id)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 