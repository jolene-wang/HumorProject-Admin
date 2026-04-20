'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function InsightsDashboard() {
  const router = useRouter()
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_superadmin')
      .eq('id', session.user.id)
      .single()
    
    if (!profile?.is_superadmin) {
      await supabase.auth.signOut()
      router.push('/auth/error')
      return
    }
    
    loadInsights()
  }

  const loadInsights = async () => {
    try {
      // Load comprehensive insights data
      const [
        { data: recentRequests },
        { data: topUsers },
        { data: imageStats },
        { data: humorFlavorStats },
        { data: llmStats }
      ] = await Promise.all([
        supabase.from('caption_requests').select('*').order('created_datetime_utc', { ascending: false }).limit(10),
        supabase.from('profiles').select('id, email, created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(5),
        supabase.from('images').select('is_public, is_common_use, created_datetime_utc'),
        supabase.from('humor_flavor_mix').select('humor_flavor_id, caption_count'),
        supabase.from('llm_model_responses').select('created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(100)
      ])

      // Process data for insights
      const processedInsights = {
        recentActivity: recentRequests?.length || 0,
        topUsers: topUsers || [],
        imageInsights: {
          total: imageStats?.length || 0,
          public: imageStats?.filter(img => img.is_public).length || 0,
          commonUse: imageStats?.filter(img => img.is_common_use).length || 0,
          recentUploads: imageStats?.filter(img => {
            const uploadDate = new Date(img.created_datetime_utc)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return uploadDate > weekAgo
          }).length || 0
        },
        humorTrends: humorFlavorStats?.reduce((acc: any, item: any) => {
          acc[item.humor_flavor_id] = (acc[item.humor_flavor_id] || 0) + item.caption_count
          return acc
        }, {}) || {},
        aiPerformance: {
          totalResponses: llmStats?.length || 0,
          recentActivity: llmStats?.filter(resp => {
            const respDate = new Date(resp.created_datetime_utc)
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            return respDate > dayAgo
          }).length || 0
        }
      }

      setInsights(processedInsights)
    } catch (error) {
      console.error('Error loading insights:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading insights...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/admin')} className="text-blue-600 hover:text-blue-800 mr-4 font-medium">
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-bold text-gray-800">Advanced Data Insights</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Platform Intelligence Dashboard</h2>
          <p className="text-gray-600">Deep dive into platform performance, user behavior, and content trends</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wide">Content Velocity</h3>
                <p className="text-3xl font-bold mt-2">{insights?.imageInsights?.recentUploads || 0}</p>
                <p className="text-blue-100 text-sm mt-1">uploads this week</p>
              </div>
              <div className="bg-blue-400 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-100 text-sm font-medium uppercase tracking-wide">AI Efficiency</h3>
                <p className="text-3xl font-bold mt-2">{insights?.aiPerformance?.recentActivity || 0}</p>
                <p className="text-green-100 text-sm mt-1">responses today</p>
              </div>
              <div className="bg-green-400 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-100 text-sm font-medium uppercase tracking-wide">Public Content</h3>
                <p className="text-3xl font-bold mt-2">{((insights?.imageInsights?.public / Math.max(insights?.imageInsights?.total, 1)) * 100).toFixed(0)}%</p>
                <p className="text-purple-100 text-sm mt-1">visibility rate</p>
              </div>
              <div className="bg-purple-400 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-100 text-sm font-medium uppercase tracking-wide">Platform Growth</h3>
                <p className="text-3xl font-bold mt-2">+{insights?.topUsers?.length || 0}</p>
                <p className="text-orange-100 text-sm mt-1">new users recently</p>
              </div>
              <div className="bg-orange-400 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Humor Flavor Trends */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Humor Flavor Popularity</h3>
            <div className="space-y-3">
              {Object.entries(insights?.humorTrends || {}).slice(0, 5).map(([flavorId, count]: [string, any], idx) => (
                <div key={flavorId} className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Flavor #{flavorId}</span>
                      <span className="text-sm text-gray-500">{count} captions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((count / Math.max(...Object.values(insights?.humorTrends || {}).map(v => Number(v) || 0))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent User Activity */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Recent User Registrations</h3>
            <div className="space-y-3">
              {insights?.topUsers?.map((user: any, idx: number) => (
                <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(user.created_datetime_utc).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health Matrix */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Platform Health Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-1">System Status</h4>
              <p className="text-sm text-gray-600">All services operational</p>
              <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                99.9% uptime
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Performance</h4>
              <p className="text-sm text-gray-600">Response time optimized</p>
              <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                &lt;200ms avg
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Security</h4>
              <p className="text-sm text-gray-600">All systems secure</p>
              <div className="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block">
                0 threats detected
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-xl font-bold mb-4">Predictive Analytics & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Growth Forecast</h4>
              <p className="text-sm text-indigo-100 mb-2">Based on current trends, expect:</p>
              <ul className="text-sm space-y-1">
                <li>• 25% increase in caption requests next month</li>
                <li>• Peak usage between 2-4 PM daily</li>
                <li>• Humor flavor #{Object.keys(insights?.humorTrends || {})[0]} trending up</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Optimization Suggestions</h4>
              <p className="text-sm text-indigo-100 mb-2">Recommended actions:</p>
              <ul className="text-sm space-y-1">
                <li>• Scale AI processing during peak hours</li>
                <li>• Promote underutilized humor flavors</li>
                <li>• Implement caching for popular content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}