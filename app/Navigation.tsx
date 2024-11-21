'use client'

import Link from 'next/link'
import { useAuth } from './contexts/AuthContext'

export default function Navigation() {
  const { user, logout } = useAuth()

  return (
    <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
      <Link href="/" className="text-2xl font-bold mb-2 sm:mb-0">University Course Manager</Link>
      <ul className="flex space-x-4">
        <li><Link href="/courses" className="hover:underline">Courses</Link></li>
        <li><Link href="/swap" className="hover:underline">Swap</Link></li>
        {user && <li><Link href="/chat" className="hover:underline">Chat</Link></li>}
        {user && user.isAdmin && <li><Link href="/admin" className="hover:underline">Admin</Link></li>}
        {user ? (
          <>
            <li><span>{user.email}</span></li>
            <li><button onClick={logout} className="hover:underline">Logout</button></li>
          </>
        ) : (
          <li><Link href="/login" className="hover:underline">Login</Link></li>
        )}
      </ul>
    </nav>
  )
}
