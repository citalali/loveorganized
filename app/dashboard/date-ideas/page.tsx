// app/dashboard/date-ideas/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/lib/stores'

type DateIdea = {
  id: string
  title: string
  description: string | null
  category: string | null
  cost_level: string | null
}

export default function DateIdeasPage() {
  const router = useRouter()
  const showNotification = useNotificationStore((s) => s.showNotification)
  const [ideas, setIdeas] = useState<DateIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('outdoor')
  const [newCost, setNewCost] = useState('low')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        router.push('/')
        return
      }

      const uid = sessionData.session.user.id
      setUserId(uid)

      const { data, error } = await supabase
        .from('date_ideas')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })

      if (!error) {
        setIdeas(data || [])
      }
      setLoading(false)
    }

    fetchIdeas()

    const subscription = supabase
      .channel('date-ideas-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_ideas' }, () => {
        fetchIdeas()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !userId) return

    const { error } = await supabase.from('date_ideas').insert({
      user_id: userId,
      title: newTitle,
      category: newCategory,
      cost_level: newCost,
    })

    if (!error) {
      setNewTitle('')
      showNotification('Date idea added!', 'success')
    } else {
      showNotification('Failed to add date idea', 'error')
    }
  }

  const filteredIdeas =
    filter === 'all' ? ideas : ideas.filter((idea) => idea.category === filter)

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Date Ideas</h1>

      {/* Add New Idea */}
      <form onSubmit={handleAddIdea} className="bg-white p-6 rounded-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Date idea title..."
            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          >
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
          </select>
          <select
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          >
            <option value="free">Free</option>
            <option value="low">Low Cost</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
        >
          Add Idea
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'outdoor', 'indoor', 'food', 'entertainment'].map((f) => (
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

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900">{idea.title}</h3>
              {idea.description && <p className="text-sm text-gray-600 mt-2">{idea.description}</p>}
              <div className="flex gap-2 mt-4">
                {idea.category && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {idea.category}
                  </span>
                )}
                {idea.cost_level && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {idea.cost_level}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-12 text-gray-500 col-span-full">
            No date ideas yet. Add one to get started!
          </p>
        )}
      </div>
    </div>
  )
}
