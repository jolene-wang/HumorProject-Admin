'use client'
import DataTable from '@/components/DataTable'

export default function LLMResponsesPage() {
  return (
    <DataTable
      title="LLM Responses"
      tableName="llm_responses"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'llm_prompt_chain_id', label: 'Chain ID' },
        { key: 'response_text', label: 'Response', render: (val) => val?.slice(0, 100) + '...' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
      ]}
      limit={100}
    />
  )
}
