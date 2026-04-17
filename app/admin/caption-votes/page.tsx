'use client'
import DataTable from '@/components/DataTable'

export default function CaptionVotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Caption Voting Activity</h2>
          <p className="text-gray-600">User votes on captions showing engagement and preferences. This data helps understand which captions resonate with users.</p>
        </div>
        <DataTable
          title="Caption Votes"
          tableName="caption_votes"
          orderBy="id"
          columns={[
            { key: 'id', label: 'Vote ID' },
            { key: 'caption_id', label: 'Caption ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No caption</span>
              return <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{val}</span>
            }},
            { key: 'profile_id', label: 'User ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No user</span>
              return <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'vote_type', label: 'Vote Type', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No vote type</span>
              return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                val === 'up' ? 'bg-green-100 text-green-800' : 
                val === 'down' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {val === 'up' ? '👍 Upvote' : val === 'down' ? '👎 Downvote' : val}
              </span>
            }},
            { key: 'created_datetime_utc', label: 'Voted At', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}