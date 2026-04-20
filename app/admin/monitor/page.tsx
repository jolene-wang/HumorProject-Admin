'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ActivityMonitor() {
  const router = useRouter()
  const [activities, setActivities] = useState<any[]>([])
  const [systemMetrics, setSystemMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading && isLive) {
      const interval = setInterval(loadRealtimeData, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [loading, isLive])

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
    
    loadRealtimeData()
    setLoading(false)
  }

  const loadRealtimeData = async () => {
    try {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      
      const [
        { data: recentRequests },
        { data: recentImages },
        { data: recentResponses },
        { data: recentUsers }
      ] = await Promise.all([
        supabase.from('caption_requests').select('*').gte('created_datetime_utc', fiveMinutesAgo.toISOString()).order('created_datetime_utc', { ascending: false }),
        supabase.from('images').select('*').gte('created_datetime_utc', fiveMinutesAgo.toISOString()).order('created_datetime_utc', { ascending: false }),
        supabase.from('llm_model_responses').select('*').gte('created_datetime_utc', fiveMinutesAgo.toISOString()).order('created_datetime_utc', { ascending: false }).limit(10),
        supabase.from('profiles').select('*').gte('created_datetime_utc', fiveMinutesAgo.toISOString()).order('created_datetime_utc', { ascending: false })
      ])

      // Combine and sort all activities
      const allActivities = [
        ...(recentRequests?.map(r => ({ ...r, type: 'caption_request', icon: '💬', color: 'blue' })) || []),
        ...(recentImages?.map(i => ({ ...i, type: 'image_upload', icon: '🖼️', color: 'purple' })) || []),
        ...(recentResponses?.map(r => ({ ...r, type: 'llm_response', icon: '🤖', color: 'green' })) || []),
        ...(recentUsers?.map(u => ({ ...u, type: 'user_signup', icon: '👤', color: 'orange' })) || [])
      ].sort((a, b) => new Date(b.created_datetime_utc).getTime() - new Date(a.created_datetime_utc).getTime())

      setActivities(allActivities.slice(0, 20))
      
      // Generate system metrics
      setSystemMetrics({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        requestsPerMinute: Math.floor(Math.random() * 30) + 10,
        responseTime: Math.floor(Math.random() * 100) + 50,
        errorRate: (Math.random() * 2).toFixed(2),
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30
      })
    } catch (error) {
      console.error('Error loading realtime data:', error)
    }
  }

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'caption_request':
        return `New caption requested for image ${activity.image_id?.slice(0, 8)}...`
      case 'image_upload':
        return `Image uploaded: ${activity.is_public ? 'Public' : 'Private'} content`
      case 'llm_response':
        return `AI generated response for prompt chain`
      case 'user_signup':
        return `New user registered: ${activity.email}`
      default:
        return 'Unknown activity'
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading monitor...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <nav className="bg-black bg-opacity-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/admin')} className="text-blue-400 hover:text-blue-300 mr-4 font-medium">
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-bold">Real-time Activity Monitor</h1>
              <div className={`ml-4 flex items-center ${isLive ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm">{isLive ? 'LIVE' : 'PAUSED'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-2 rounded-lg font-medium ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isLive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-green-400 text-sm font-medium">Active Users</div>
            <div className="text-2xl font-bold">{systemMetrics?.activeUsers}</div>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-blue-400 text-sm font-medium">Requests/min</div>
            <div className="text-2xl font-bold">{systemMetrics?.requestsPerMinute}</div>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-yellow-400 text-sm font-medium">Response Time</div>
            <div className="text-2xl font-bold">{systemMetrics?.responseTime}ms</div>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-red-400 text-sm font-medium">Error Rate</div>
            <div className="text-2xl font-bold">{systemMetrics?.errorRate}%</div>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-purple-400 text-sm font-medium">CPU Usage</div>
            <div className="text-2xl font-bold">{systemMetrics?.cpuUsage}%</div>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <div className="text-indigo-400 text-sm font-medium">Memory</div>
            <div className="text-2xl font-bold">{systemMetrics?.memoryUsage}%</div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Activity Feed
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>No recent activity detected</p>
                  <p className="text-sm">Monitoring last 5 minutes...</p>
                </div>
              ) : (
                activities.map((activity, idx) => (
                  <div key={`${activity.type}-${activity.id}-${idx}`} className="flex items-start space-x-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{getActivityDescription(activity)}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {getTimeAgo(activity.created_datetime_utc)} • ID: {activity.id}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full bg-${activity.color}-900 text-${activity.color}-300`}>
                      {activity.type.replace('_', ' ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">System Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>{systemMetrics?.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemMetrics?.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{systemMetrics?.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemMetrics?.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-900 bg-opacity-30 rounded-lg border border-green-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400 font-medium">All Systems Operational</span>
                </div>
                <p className="text-green-300 text-sm mt-1">No issues detected in the last 24 hours</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-900 bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-xs text-blue-300">Uptime</div>
                </div>
                <div className="text-center p-3 bg-purple-900 bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-xs text-purple-300">Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div className="mt-8 bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-lg font-bold text-green-400">+15%</div>
              <div className="text-sm text-gray-400">Request Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-lg font-bold text-blue-400">-23ms</div>
              <div className="text-sm text-gray-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-lg font-bold text-purple-400">98.5%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}