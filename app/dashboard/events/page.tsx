// app/dashboard/events/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/lib/stores'

type Event = {
  id: string
  title: string
  date: string | null
  location: string | null
}

type PackingItem = {
  id: string
  item_name: string
  is_packed: boolean
  assigned_to: string | null
}

export default function EventsPage() {
  const router = useRouter()
  const showNotification = useNotificationStore((s) => s.showNotification)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  const [newPackingItem, setNewPackingItem] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        router.push('/')
        return
      }

      const uid = sessionData.session.user.id
      setUserId(uid)

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })

      if (!error) {
        setEvents(data || [])
        if (data && data.length > 0) {
          setSelectedEventId(data[0].id)
          await fetchPackingItems(data[0].id)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [router])

  const fetchPackingItems = async (eventId: string) => {
    const { data, error } = await supabase
      .from('packing_items')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (!error) {
      setPackingItems(data || [])
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEventTitle.trim() || !userId) return

    const { error, data } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        title: newEventTitle,
      })
      .select()

    if (!error && data) {
      setNewEventTitle('')
      setSelectedEventId(data[0].id)
      showNotification('Event created!', 'success')
    }
  }

  const handleAddPackingItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPackingItem.trim() || !selectedEventId) return

    const { error } = await supabase.from('packing_items').insert({
      event_id: selectedEventId,
      item_name: newPackingItem,
    })

    if (!error) {
      setNewPackingItem('')
      await fetchPackingItems(selectedEventId)
      showNotification('Item added!', 'success')
    }
  }

  const togglePackingItem = async (itemId: string, isPacked: boolean) => {
    const { error } = await supabase
      .from('packing_items')
      .update({ is_packed: !isPacked })
      .eq('id', itemId)

    if (!error && selectedEventId) {
      await fetchPackingItems(selectedEventId)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Events & Packing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div>
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Your Events</h2>

            <form onSubmit={handleAddEvent} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event name..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEventId(event.id)
                    fetchPackingItems(event.id)
                  }}
                  className={`w-full p-3 text-left rounded-lg transition text-sm ${
                    selectedEventId === event.id
                      ? 'bg-pink-100 border border-pink-300'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {event.title}
                </button>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No events yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Packing Items */}
        <div className="lg:col-span-2">
          {selectedEventId ? (
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Packing List</h2>

              <form onSubmit={handleAddPackingItem} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPackingItem}
                    onChange={(e) => setNewPackingItem(e.target.value)}
                    placeholder="Add item..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {packingItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.is_packed}
                      onChange={() => togglePackingItem(item.id, item.is_packed)}
                      className="w-4 h-4 text-pink-600 rounded cursor-pointer"
                    />
                    <span className={item.is_packed ? 'line-through text-gray-400' : 'text-gray-700'}>
                      {item.item_name}
                    </span>
                  </div>
                ))}
                {packingItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No items yet</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              Create an event to start a packing list
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
