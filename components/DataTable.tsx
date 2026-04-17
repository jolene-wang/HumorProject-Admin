'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  title: string
  tableName: string
  columns: Column[]
  orderBy?: string
  limit?: number
}

export default function DataTable({ title, tableName, columns, orderBy, limit }: DataTableProps) {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 100

  // Default orderBy to 'id' if created_datetime_utc doesn't exist
  const defaultOrderBy = orderBy || 'id'

  useEffect(() => {
    if (!loading) loadData()
  }, [page])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_superadmin')
      .eq('id', session.user.id)
      .single()
    
    if (!profile?.is_superadmin) {
      await supabase.auth.signOut()
      router.push('/auth/error')
      return
    }
    
    loadData()
  }

  const loadData = async () => {
    try {
      setError(null)
      let query = supabase.from(tableName).select('*', { count: 'exact' })
      if (defaultOrderBy) query = query.order(defaultOrderBy, { ascending: false })
      
      const from = page * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)
      
      const { data: result, count, error: queryError } = await query
      
      if (queryError) {
        console.error('Query error:', queryError)
        setError(`Database error: ${queryError.message}`)
        setData([])
      } else {
        setData(result || [])
        setHasMore(count ? (page + 1) * pageSize < count : false)
      }
    } catch (err) {
      console.error('Load data error:', err)
      setError('Failed to load data')
      setData([])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/admin')} className="text-blue-600 hover:text-blue-800 mr-4 font-medium">
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 font-medium">Error loading {title.toLowerCase()}</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <p className="text-red-600 text-sm mt-1">Table: {tableName}</p>
            </div>
          )}
          
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5" />
              </svg>
              <p className="text-gray-500 font-medium">No {title.toLowerCase()} found</p>
              <p className="text-gray-400 text-sm mt-1">This table appears to be empty or the data hasn't been created yet.</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
