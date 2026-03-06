'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ImagesPage() {
  const router = useRouter()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingImage, setEditingImage] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

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
    
    loadImages()
  }

  const loadImages = async () => {
    const res = await fetch('/api/images')
    const { data } = await res.json()
    setImages(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' })
    const result = await res.json()
    if (result.error) {
      alert('Error deleting image: ' + result.error.message)
    } else {
      alert('Image deleted successfully')
      loadImages()
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingImage)
    })
    const result = await res.json()
    if (result.error) {
      alert('Error updating image: ' + result.error.message)
    } else {
      alert('Image updated successfully')
      setEditingImage(null)
      loadImages()
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newImage = {
      url: formData.get('url'),
      profile_id: formData.get('profile_id'),
      is_public: formData.get('is_public') === 'true',
      is_common_use: formData.get('is_common_use') === 'true',
      image_description: formData.get('image_description'),
      additional_context: formData.get('additional_context')
    }
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newImage)
    })
    const result = await res.json()
    if (result.error) {
      alert('Error creating image: ' + result.error.message)
    } else {
      alert('Image created successfully')
      setShowCreateForm(false)
      loadImages()
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/admin')} className="text-blue-600 hover:text-blue-800 mr-4">
                ← Back
              </button>
              <h1 className="text-xl font-bold">Image Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Image
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Image</h2>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input name="url" required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile ID</label>
                    <input name="profile_id" required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="image_description" className="w-full border rounded px-3 py-2" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Context</label>
                    <textarea name="additional_context" className="w-full border rounded px-3 py-2" rows={2} />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input name="is_public" type="checkbox" value="true" className="mr-2" />
                      Public
                    </label>
                    <label className="flex items-center">
                      <input name="is_common_use" type="checkbox" value="true" className="mr-2" />
                      Common Use
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create
                  </button>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
              <form onSubmit={handleUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input
                      value={editingImage.url}
                      onChange={(e) => setEditingImage({ ...editingImage, url: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editingImage.image_description || ''}
                      onChange={(e) => setEditingImage({ ...editingImage, image_description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingImage.is_public}
                        onChange={(e) => setEditingImage({ ...editingImage, is_public: e.target.checked })}
                        className="mr-2"
                      />
                      Public
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingImage.is_common_use}
                        onChange={(e) => setEditingImage({ ...editingImage, is_common_use: e.target.checked })}
                        className="mr-2"
                      />
                      Common Use
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingImage(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <Image src={image.url} alt="Image" fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-2">{image.id.slice(0, 8)}...</p>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{image.image_description}</p>
                <div className="flex gap-2 mb-2">
                  {image.is_public && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Public</span>}
                  {image.is_common_use && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Common</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
