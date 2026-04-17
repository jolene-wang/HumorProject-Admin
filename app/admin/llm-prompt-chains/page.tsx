'use client'
import DataTable from '@/components/DataTable'

export default function LLMPromptChainsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Prompt Chain Management</h2>
          <p className="text-gray-600">Sequences of prompts sent to AI models for caption generation. Each chain links a caption request to a specific AI model and tracks the processing pipeline.</p>
        </div>
        <DataTable
          title="LLM Prompt Chains"
          tableName="llm_prompt_chains"
          columns={[
            { key: 'id', label: 'Chain ID', render: (val) => val?.slice(0, 8) + '...' },
            { key: 'caption_request_id', label: 'Request ID', render: (val) => val?.slice(0, 8) + '...' },
            { key: 'llm_model_id', label: 'Model ID', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No model assigned</span>
              return val?.slice(0, 8) + '...'
            }},
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
          ]}
          limit={100}
        />
      </div>
    </div>
  )
}
