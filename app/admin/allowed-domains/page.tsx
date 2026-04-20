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
            { key: 'apex_domain', label: 'Domain', required: true },
          ]}
          displayColumns={[
            { key: 'id', label: 'ID' },
            { key: 'apex_domain', label: 'Domain', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">No domain</span>
              return <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{val}</span>
            }},
            { key: 'created_by_user_id', label: 'Created By', render: (val) => {
              if (!val) return <span className="text-gray-400 italic">System</span>
              return <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{val.slice(0, 8)}...</span>
            }},
            { key: 'created_datetime_utc', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
            { key: 'modified_datetime_utc', label: 'Last Modified', render: (val) => new Date(val).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  )
}
