'use client'
import CRUDTable from '@/components/CRUDTable'

export default function WhitelistedEmailsPage() {
  return (
    <CRUDTable
      title="Whitelisted Email Addresses"
      tableName="whitelist_email_addresses"
      fields={[
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'is_active', label: 'Active', render: (val) => val ? '✓' : '✗' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
      ]}
    />
  )
}
