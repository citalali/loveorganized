// components/Notification.tsx
'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/lib/stores'

export default function Notification() {
  const { message, type, clearNotification } = useNotificationStore()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearNotification, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, clearNotification])

  if (!message) return null

  const bgColor =
    type === 'success'
      ? 'bg-green-100 text-green-700'
      : type === 'error'
        ? 'bg-red-100 text-red-700'
        : 'bg-blue-100 text-blue-700'

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg ${bgColor}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
