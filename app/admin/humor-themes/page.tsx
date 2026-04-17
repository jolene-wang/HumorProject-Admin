'use client'
import DataTable from '@/components/DataTable'

export default function HumorThemesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Humor Themes Management</h2>
          <p className="text-gray-600">Different comedy themes and categories used to classify humor styles. These themes help organize and categorize different types of humor content.</p>
        </div>
        <DataTable
          title="Humor Themes"
          tableName="humor_themes"
          orderBy="id"
          columns={[
            { key: 'id', label: 'Theme ID' },
            { key: 'name', label: 'Theme Name' },
            { key: 'description', label: 'Description', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No description</span>
              return <div className="max-w-xs truncate" title={val}>{val}</div>
            }},
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}