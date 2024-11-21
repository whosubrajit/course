'use client'

import Link from 'next/link'
import { useAuth } from './contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to University Course Manager</h1>
      <p className="text-xl">Manage your courses, swap sections, chat with your peers, and review faculty all in one place.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/faculty-reviews" className="bg-yellow-500 text-white p-4 rounded-lg text-center hover:bg-yellow-600 transition-colors">
          Faculty Reviews
        </Link>
        {user ? (
          <>
            <Link href="/courses" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors">
              Choose Courses
            </Link>
            <Link href="/swap" className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors">
              Swap Sections
            </Link>
            <Link href="/chat" className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors">
              Private Chat
            </Link>
          </>
        ) : (
          <Link href="/login" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors">
            Login / Sign Up
          </Link>
        )}
      </div>
    </div>
  )
}
