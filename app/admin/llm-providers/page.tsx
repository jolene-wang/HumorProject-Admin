'use client'
import CRUDTable from '@/components/CRUDTable'

export default function LLMProvidersPage() {
  return (
    <CRUDTable
      title="LLM Providers"
      tableName="llm_providers"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'api_base_url', label: 'API Base URL', required: true },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'api_base_url', label: 'API URL' },
        { key: 'is_active', label: 'Active', render: (val) => val ? '✓' : '✗' },
      ]}
    />
  )
}
