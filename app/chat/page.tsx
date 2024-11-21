'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
  encrypted: string
}

// Simulated user list (in a real app, this would come from a backend)
const users = ['alice@example.com', 'bob@example.com', 'charlie@example.com']

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null)
  const [publicKeys, setPublicKeys] = useState<{[key: string]: CryptoKey}>({})

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      // Generate a key pair for the current user
      generateKeyPair()
    }
  }, [user, router])

  async function generateKeyPair() {
    const newKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    )
    setKeyPair(newKeyPair)

    // In a real app, you would send the public key to a server here
    // For this example, we'll simulate it by adding it to the publicKeys state
    if (user) {
      setPublicKeys(prev => ({...prev, [user.email]: newKeyPair.publicKey}))
    }
  }

  async function encryptMessage(message: string, publicKey: CryptoKey) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      data
    )
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  }

  async function decryptMessage(encryptedMessage: string) {
    if (!keyPair) return ''
    const decoder = new TextDecoder()
    const data = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0))
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      keyPair.privateKey,
      data
    )
    return decoder.decode(decrypted)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser && keyPair) {
      const publicKey = publicKeys[selectedUser]
      if (!publicKey) {
        alert('Cannot send message: recipient\'s public key not found')
        return
      }

      const encrypted = await encryptMessage(newMessage, publicKey)
      const newMsg: Message = { 
        id: Date.now(), 
        sender: user?.email || 'Anonymous', 
        content: `To ${selectedUser}: ${newMessage}`,
        encrypted,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Private Chat</h2>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">End-to-End Encrypted Chat</p>
        <p>Your messages are encrypted and can only be read by the intended recipient.</p>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/4">
          <h3 className="text-xl font-semibold mb-2">Select a user to chat with:</h3>
          <select 
            value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a user</option>
            {users.filter(u => u !== user.email).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="w-3/4 border rounded-lg h-[500px] flex flex-col">
          <div className="flex-grow overflow-auto p-4 space-y-2">
            {messages.filter(m => 
              (m.sender === user.email && m.content.startsWith(`To ${selectedUser}:`)) || 
              (m.sender === selectedUser && m.content.startsWith(`To ${user.email}:`))
            ).map(message => (
              <div key={message.id} className="mb-2">
                <span className="font-bold">{message.sender}:</span>{' '}
                {message.sender === user.email ? message.content : 'Encrypted message'}
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
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
