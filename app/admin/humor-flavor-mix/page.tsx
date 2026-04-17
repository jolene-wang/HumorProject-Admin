'use client'
import DataTable from '@/components/DataTable'

export default function HumorFlavorMixPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Humor Flavor Preferences</h2>
          <p className="text-gray-600">Individual user preferences for different humor flavors. Each user has personalized weights that determine which comedy styles they prefer for caption generation.</p>
        </div>
        <DataTable
          title="Humor Flavor Mix"
          tableName="humor_flavor_mix"
          orderBy="id"
          columns={[
            { key: 'id', label: 'Mix ID' },
            { key: 'profile_id', label: 'User ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No user</span>
              return <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'humor_flavor_id', label: 'Flavor ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No flavor</span>
              return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Flavor #{val}</span>
            }},
            { key: 'weight', label: 'Preference Weight', render: (val) => {
              if (val === null || val === undefined) return <span className="text-gray-400 italic">No weight</span>
              return (
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min(val * 100, 100)}%`}}></div>
                  </div>
                  <span className="font-medium">{val.toFixed(2)}</span>
                </div>
              )
            }},
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}