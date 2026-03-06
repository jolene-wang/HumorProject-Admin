'use client'
import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-700 mb-4">
          You do not have permission to access the admin area. Only superadmin users can access this area.
        </p>
        {error && <p className="text-sm text-gray-500">Error: {error}</p>}
      </div>
    </div>
  )
}
