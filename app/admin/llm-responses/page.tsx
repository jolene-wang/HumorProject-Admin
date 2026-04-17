'use client'
import DataTable from '@/components/DataTable'

export default function LLMResponsesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Model Responses</h2>
          <p className="text-gray-600">Generated responses from Large Language Models (LLMs) used for caption creation. Each response is linked to a specific prompt chain and contains the AI-generated text output.</p>
        </div>
        <DataTable
          title="LLM Responses"
          tableName="llm_model_responses"
          columns={[
            { key: 'id', label: 'Response ID' },
            { key: 'llm_prompt_chain_id', label: 'Chain ID', render: (val) => val?.slice(0, 8) + '...' },
            { key: 'response_text', label: 'Response', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No response text</span>
              return <div className="max-w-xs truncate" title={val}>{val.slice(0, 100)}...</div>
            }},
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}
