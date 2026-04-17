'use client'
import DataTable from '@/components/DataTable'

export default function CaptionScoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Caption Scoring System</h2>
          <p className="text-gray-600">Numerical scores assigned to captions based on various metrics like humor, relevance, and user engagement.</p>
        </div>
        <DataTable
          title="Caption Scores"
          tableName="caption_scores"
          orderBy="id"
          columns={[
            { key: 'id', label: 'Score ID' },
            { key: 'caption_id', label: 'Caption ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No caption</span>
              return <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{val}</span>
            }},
            { key: 'score', label: 'Score', render: (val) => {
              if (val === null || val === undefined) return <span className="text-gray-400 italic">No score</span>
              const scoreColor = val >= 8 ? 'text-green-600' : val >= 5 ? 'text-yellow-600' : 'text-red-600'
              return <span className={`font-bold ${scoreColor}`}>{val.toFixed(2)}</span>
            }},
            { key: 'score_type', label: 'Score Type', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No type</span>
              return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {val}
              </span>
            }},
            { key: 'created_datetime_utc', label: 'Scored At', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}