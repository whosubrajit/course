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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      // In a real app, you'd fetch messages from a backend here
      setMessages([
        { id: 1, sender: 'System', content: 'Welcome to the private chat!', timestamp: new Date().toISOString() },
      ])
    }
  }, [user, router])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = { 
        id: Date.now(), 
        sender: user?.email || 'Anonymous', 
        content: newMessage,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')

      // In a real app, you'd send this message to a backend here
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Private Chat</h2>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Caution!</p>
        <p>Please use appropriate language in the chat. The use of slang, cuss words, or threatening language is strictly prohibited. Violations may result in suspension or permanent ban from the chat system.</p>
      </div>
      <div className="border rounded-lg h-[500px] flex flex-col">
        <div className="flex-grow overflow-auto p-4 space-y-2">
          {messages.map(message => (
            <div key={message.id} className="mb-2">
              <span className="font-bold">{message.sender}:</span> {message.content}
              <span className="text-xs text-gray-500 ml-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}