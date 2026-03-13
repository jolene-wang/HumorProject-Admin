'use client'
import DataTable from '@/components/DataTable'

export default function LLMPromptChainsPage() {
  return (
    <DataTable
      title="LLM Prompt Chains"
      tableName="llm_prompt_chains"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'caption_request_id', label: 'Request ID' },
        { key: 'llm_model_id', label: 'Model ID' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
      ]}
      limit={100}
    />
  )
}
