'use client'
import DataTable from '@/components/DataTable'

export default function HumorFlavorsPage() {
  return (
    <DataTable
      title="Humor Flavors"
      tableName="humor_flavors"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'is_active', label: 'Active', render: (val) => val ? '✓' : '✗' },
      ]}
      orderBy="id"
    />
  )
}
