'use client'
import CRUDTable from '@/components/CRUDTable'

export default function CaptionExamplesPage() {
  return (
    <CRUDTable
      title="Caption Examples"
      tableName="caption_examples"
      fields={[
        { key: 'humor_flavor_id', label: 'Humor Flavor ID', type: 'number', required: true },
        { key: 'example_text', label: 'Example Text', type: 'textarea', required: true },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'humor_flavor_id', label: 'Flavor ID' },
        { key: 'example_text', label: 'Example', render: (val) => val?.slice(0, 100) + '...' },
      ]}
    />
  )
}
