'use client'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <p className="text-gray-600 mb-4">Sign in with your Google account to access the admin area.</p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
