// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-semibold text-pink-600">
            💕 Couples
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-pink-600">
              Dashboard
            </Link>
            <Link href="/dashboard/date-ideas" className="text-sm text-gray-600 hover:text-pink-600">
              Date Ideas
            </Link>
            <Link href="/dashboard/todos" className="text-sm text-gray-600 hover:text-pink-600">
              To-Dos
            </Link>
            <Link href="/dashboard/events" className="text-sm text-gray-600 hover:text-pink-600">
              Events
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block text-sm text-gray-600 hover:text-pink-600 py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/date-ideas"
              className="block text-sm text-gray-600 hover:text-pink-600 py-2"
            >
              Date Ideas
            </Link>
            <Link
              href="/dashboard/todos"
              className="block text-sm text-gray-600 hover:text-pink-600 py-2"
            >
              To-Dos
            </Link>
            <Link
              href="/dashboard/events"
              className="block text-sm text-gray-600 hover:text-pink-600 py-2"
            >
              Events
            </Link>
            <button
              onClick={handleLogout}
              className="block text-sm w-full text-left px-2 py-2 bg-pink-100 text-pink-700 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
