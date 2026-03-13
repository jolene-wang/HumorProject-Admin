'use client'
import CRUDTable from '@/components/CRUDTable'

export default function AllowedDomainsPage() {
  return (
    <CRUDTable
      title="Allowed Signup Domains"
      tableName="allowed_signup_domains"
      fields={[
        { key: 'domain', label: 'Domain', required: true },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
      displayColumns={[
        { key: 'id', label: 'ID' },
        { key: 'domain', label: 'Domain' },
        { key: 'is_active', label: 'Active', render: (val) => val ? '✓' : '✗' },
        { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
      ]}
    />
  )
}
