'use client'

import { create } from 'zustand'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  message: string
  type: NotificationType
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (index: number) => void
}

export const useNotifications = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification]
    })),
  removeNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index)
    }))
})) 