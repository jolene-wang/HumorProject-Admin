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
        { key: 'provider_model_id', label: 'Provider Model ID', required: true },
        { key: 'is_temperature_supported', label: 'Temperature Supported', type: 'checkbox' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'llm_provider_id', label: 'Provider ID', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No provider</span>
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Provider #{val}</span>
        }},
        { key: 'provider_model_id', label: 'Model ID', render: (val) => {
          if (!val) return <span className="text-gray-400 italic">No model ID</span>
          return <span className="font-mono text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{val}</span>
        }},
        { key: 'is_temperature_supported', label: 'Temperature', render: (val) => val ? '🌡️ Supported' : '❌ Not Supported' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
      ]}
    />
  )
}
