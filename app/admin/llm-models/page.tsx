'use client'
import CRUDTable from '@/components/CRUDTable'

export default function LLMModelsPage() {
  return (
    <CRUDTable
      title="LLM Models"
      tableName="llm_models"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'llm_provider_id', label: 'Provider ID', type: 'number', required: true },
        { key: 'model_identifier', label: 'Model Identifier', required: true },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'llm_provider_id', label: 'Provider ID' },
        { key: 'model_identifier', label: 'Identifier' },
        { key: 'is_active', label: 'Active', render: (val) => val ? '✓' : '✗' },
      ]}
    />
  )
}
