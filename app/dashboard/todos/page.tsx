// app/dashboard/todos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import TaskItem from '@/components/TaskItem'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/lib/stores'

type Todo = {
  id: string
  title: string
  is_completed: boolean
  is_shared: boolean
  assigned_to: string | null
}

export default function TodosPage() {
  const router = useRouter()
  const showNotification = useNotificationStore((s) => s.showNotification)
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isShared, setIsShared] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'shared' | 'completed'>('all')

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        router.push('/')
        return
      }

      const uid = sessionData.session.user.id
      setUserId(uid)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })

      if (!error) {
        setTodos(data || [])
      }
      setLoading(false)
    }

    fetchTodos()

    // Real-time subscription
    const subscription = supabase
      .channel('todos-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          fetchTodos()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoTitle.trim() || !userId) return

    const { error } = await supabase.from('todos').insert({
      user_id: userId,
      title: newTodoTitle,
      is_shared: isShared,
      is_completed: false,
    })

    if (!error) {
      setNewTodoTitle('')
      setIsShared(false)
      showNotification('Todo added!', 'success')
    } else {
      showNotification('Failed to add todo', 'error')
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.is_completed
    if (filter === 'completed') return todo.is_completed
    if (filter === 'shared') return todo.is_shared
    return true
  })

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">To-Dos</h1>

      {/* Add New Todo Form */}
      <form onSubmit={handleAddTodo} className="bg-white p-6 rounded-lg border border-gray-100 mb-8">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
          >
            Add
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="w-4 h-4 text-pink-600 rounded"
          />
          Mark as shared task
        </label>
      </form>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'active', 'shared', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? 'bg-pink-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-pink-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todos List */}
      <div className="space-y-3">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              isCompleted={todo.is_completed}
              isShared={todo.is_shared}
              assignedTo={todo.assigned_to}
              onUpdate={() => {}}
            />
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">No todos yet. Add one to get started!</p>
        )}
      </div>
    </div>
  )
}
