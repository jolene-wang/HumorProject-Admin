'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setStats(data))
    }
  }, [session])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">HumorProject Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Images</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalImages}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Captions</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalCaptions}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Public Images</h3>
                <p className="text-3xl font-bold mt-2">{stats.publicImages}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Avg Caption Likes</h3>
                <p className="text-3xl font-bold mt-2">{stats.avgLikes}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Recent Activity</h3>
                <p className="text-3xl font-bold mt-2">{stats.recentActivity}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-gray-600">View user profiles</p>
          </button>
          <button
            onClick={() => router.push('/admin/images')}
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">Manage Images</h3>
            <p className="text-gray-600">Create, read, update, delete images</p>
          </button>
          <button
            onClick={() => router.push('/admin/captions')}
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">View Captions</h3>
            <p className="text-gray-600">Browse all captions</p>
          </button>
        </div>
      </div>
    </div>
  )
}
