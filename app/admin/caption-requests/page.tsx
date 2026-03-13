'use client'
import DataTable from '@/components/DataTable'

export default function CaptionRequestsPage() {
  return (
    <DataTable
      title="Caption Requests"
      tableName="caption_requests"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'profile_id', label: 'Profile ID', render: (val) => val?.slice(0, 8) + '...' },
        { key: 'image_id', label: 'Image ID', render: (val) => val?.slice(0, 8) + '...' },
        { key: 'humor_flavor_id', label: 'Flavor ID' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleString() },
      ]}
      limit={100}
    />
  )
}
