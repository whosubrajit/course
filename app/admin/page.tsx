'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/')
    } else {
      // In a real app, you'd fetch the chat history from a backend here
      setChatHistory([
        { id: 1, sender: 'user1@example.com', content: 'Hello!', timestamp: '2023-06-01T10:00:00Z' },
        { id: 2, sender: 'user2@example.com', content: 'Hi there!', timestamp: '2023-06-01T10:01:00Z' },
        { id: 3, sender: 'user1@example.com', content: 'How are you?', timestamp: '2023-06-01T10:02:00Z' },
      ])
    }
  }, [user, router])

  if (!user || !user.isAdmin) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin: Chat History</h2>
      <div className="border rounded-lg p-4">
        {chatHistory.map(message => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.sender}:</span> {message.content}
            <span className="text-xs text-gray-500 ml-2">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}