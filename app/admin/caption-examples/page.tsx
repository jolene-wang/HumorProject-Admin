'use client'
import CRUDTable from '@/components/CRUDTable'

export default function CaptionExamplesPage() {
  return (
    <CRUDTable
      title="Caption Examples"
      tableName="caption_examples"
      fields={[
        { key: 'image_description', label: 'Image Description', type: 'textarea', required: true },
        { key: 'caption', label: 'Caption', type: 'textarea', required: true },
        { key: 'explanation', label: 'Explanation', type: 'textarea', required: true },
        { key: 'priority', label: 'Priority', type: 'number', required: true },
        { key: 'image_id', label: 'Image ID' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'image_description', label: 'Image Description', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No description</span>
          return <div className="max-w-xs truncate" title={val}>{val.slice(0, 50)}...</div>
        }},
        { key: 'caption', label: 'Caption', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No caption</span>
          return <div className="max-w-xs truncate" title={val}>{val}</div>
        }},
        { key: 'priority', label: 'Priority', render: (val) => {
          if (!val) return <span className="text-gray-400">0</span>
          return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            val >= 5 ? 'bg-red-100 text-red-800' : val >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>Priority {val}</span>
        }},
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
      ]}
    />
  )
}
