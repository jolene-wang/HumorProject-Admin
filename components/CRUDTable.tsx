'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Field {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'checkbox' | 'number' | 'email'
  required?: boolean
}

interface CRUDTableProps {
  title: string
  tableName: string
  fields: Field[]
  displayColumns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
}

export default function CRUDTable({ title, tableName, fields, displayColumns }: CRUDTableProps) {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 100

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
      const from = page * pageSize
      const to = from + pageSize - 1
      
      const { data: result, count, error: queryError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to)
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { id, created_datetime_utc, modified_datetime_utc, created_by_user_id, modified_by_user_id, ...updates } = formData
        const { error } = await supabase.from(tableName).update({
          ...updates,
          modified_datetime_utc: new Date().toISOString(),
          modified_by_user_id: (await supabase.auth.getSession()).data.session?.user.id
        }).eq('id', editingItem.id)
        if (error) {
          console.error('Update error:', error)
          alert('Error: ' + error.message)
        } else {
          alert('Updated successfully')
        }
      } else {
        const { data: session } = await supabase.auth.getSession()
        const userId = session.session?.user.id
        const { error } = await supabase.from(tableName).insert({
          ...formData,
          created_datetime_utc: new Date().toISOString(),
          modified_datetime_utc: new Date().toISOString(),
          created_by_user_id: userId,
          modified_by_user_id: userId
        })
        if (error) {
          console.error('Insert error:', error)
          alert('Error: ' + error.message)
        } else {
          alert('Created successfully')
        }
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Error: ' + (err as Error).message)
    }
    setShowForm(false)
    setEditingItem(null)
    setFormData({})
    loadData()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else alert('Deleted successfully')
    loadData()
  }

  const openEditForm = (item: any) => {
    setEditingItem(item)
    setFormData(item)
    setShowForm(true)
  }

  const openCreateForm = () => {
    setEditingItem(null)
    setFormData({})
    setShowForm(true)
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
            <div className="flex items-center">
              <button
                onClick={openCreateForm}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Create New
              </button>
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
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Create'} {title}</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-1">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          required={field.required}
                          className="w-full border rounded px-3 py-2"
                          rows={3}
                        />
                      ) : field.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={formData[field.key] || false}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                          className="mr-2"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          required={field.required}
                          className="w-full border rounded px-3 py-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {displayColumns.map((col) => (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {displayColumns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => openEditForm(row)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
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
              <p className="text-gray-400 text-sm mt-1">Click "Create New" to add the first entry.</p>
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
