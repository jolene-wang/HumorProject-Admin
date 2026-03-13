'use client'
import CRUDTable from '@/components/CRUDTable'

export default function TermsPage() {
  return (
    <CRUDTable
      title="Terms"
      tableName="terms"
      fields={[
        { key: 'term', label: 'Term', required: true },
        { key: 'definition', label: 'Definition', type: 'textarea' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'term', label: 'Term' },
        { key: 'definition', label: 'Definition', render: (val) => val?.slice(0, 100) + '...' },
      ]}
    />
  )
}
