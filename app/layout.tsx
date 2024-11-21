import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'University Course Manager',
  description: 'Choose courses, swap sections, and chat with peers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white p-4">
              <Navigation />
            </header>
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <footer className="bg-gray-200 p-4 text-center">
              © 2023 University Course Manager
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
