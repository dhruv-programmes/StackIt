'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const setupDatabase = async () => {
    setStatus('loading')
    setMessage('Setting up database...')
    
    try {
      const response = await fetch('/api/setup-db', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        setMessage('✅ Database setup completed successfully! You can now use the app.')
      } else {
        setStatus('error')
        setMessage(`❌ Setup failed: ${data.error}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Setup
          </h1>
          <p className="text-gray-600 mb-8">
            Click the button below to initialize your database tables.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={setupDatabase}
            disabled={status === 'loading'}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Setting up...' : 'Setup Database'}
          </button>
          
          {message && (
            <div className={`p-4 rounded-md ${
              status === 'success' ? 'bg-green-50 text-green-800' :
              status === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {message}
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Go to Homepage
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 