// components/TaskItem.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type TaskItemProps = {
  id: string
  title: string
  isCompleted: boolean
  isShared?: boolean
  assignedTo?: string
  onUpdate: () => void
}

export default function TaskItem({
  id,
  title,
  isCompleted,
  isShared,
  assignedTo,
  onUpdate,
}: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const toggleComplete = async () => {
    setIsLoading(true)
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !isCompleted })
      .eq('id', id)

    if (!error) {
      onUpdate()
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-pink-200 transition">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={toggleComplete}
        disabled={isLoading}
        className="w-5 h-5 text-pink-600 rounded cursor-pointer"
      />
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {title}
        </p>
        <div className="flex gap-2 mt-1">
          {isShared && (
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
              Shared
            </span>
          )}
          {assignedTo && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Assigned
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
