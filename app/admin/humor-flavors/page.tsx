'use client'
import DataTable from '@/components/DataTable'

export default function HumorFlavorsPage() {
  return (
    <DataTable
      title="Humor Flavors"
      tableName="humor_flavors"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'slug', label: 'Slug', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No slug</span>
          return <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{val}</span>
        }},
        { key: 'description', label: 'Description', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No description</span>
          return <div className="max-w-xs truncate" title={val}>{val}</div>
        }},
        { key: 'is_pinned', label: 'Pinned', render: (val) => val ? '📌 Pinned' : '' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
      ]}
      orderBy="id"
    />
  )
}
