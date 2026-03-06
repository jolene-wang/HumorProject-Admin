'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadUsers()
    }
  }, [session])

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_datetime_utc', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/admin')} className="text-blue-600 hover:text-blue-800 mr-4">
                ← Back
              </button>
              <h1 className="text-xl font-bold">User Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Superadmin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.username || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded ${user.is_superadmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_superadmin ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.created_datetime_utc ? new Date(user.created_datetime_utc).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
