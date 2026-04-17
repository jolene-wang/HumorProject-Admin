'use client'
import CRUDTable from '@/components/CRUDTable'

export default function WhitelistedEmailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Whitelist Management</h2>
          <p className="text-gray-600">Pre-approved email addresses that can bypass domain restrictions. These specific email addresses are always allowed to register, regardless of their domain.</p>
        </div>
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
            { key: 'is_active', label: 'Active', render: (val) => val ? '✅ Active' : '❌ Inactive' },
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  )
}
