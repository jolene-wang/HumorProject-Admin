'use client'
import DataTable from '@/components/DataTable'

export default function HumorFlavorStepsPage() {
  return (
    <DataTable
      title="Humor Flavor Steps"
      tableName="humor_flavor_steps"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'humor_flavor_id', label: 'Flavor ID' },
        { key: 'step_number', label: 'Step #' },
        { key: 'instruction', label: 'Instruction' },
      ]}
      orderBy="id"
    />
  )
}
