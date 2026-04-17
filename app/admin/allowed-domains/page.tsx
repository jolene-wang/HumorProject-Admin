'use client'
import CRUDTable from '@/components/CRUDTable'

export default function AllowedDomainsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Domain Management</h2>
          <p className="text-gray-600">Control which email domains are allowed for user registration. Only users with email addresses from these domains can sign up for the platform.</p>
        </div>
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
            { key: 'is_active', label: 'Active', render: (val) => val ? '✅ Active' : '❌ Inactive' },
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  )
}
