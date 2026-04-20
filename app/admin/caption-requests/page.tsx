'use client'
import DataTable from '@/components/DataTable'

export default function CaptionRequestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Caption Request Management</h2>
          <p className="text-gray-600">User requests for new image captions. Each request specifies an image, user preferences, and desired humor style for AI caption generation.</p>
        </div>
        <DataTable
          title="Caption Requests"
          tableName="caption_requests"
          columns={[
            { key: 'id', label: 'Request ID' },
            { key: 'profile_id', label: 'User ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No user</span>
              return <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'image_id', label: 'Image ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No image</span>
              return <span className="font-mono text-xs bg-purple-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'created_by_user_id', label: 'Created By', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">System</span>
              return <span className="font-mono text-xs bg-green-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'created_datetime_utc', label: 'Requested', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}
