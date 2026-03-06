import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabase as supabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('is_superadmin')
    .eq('id', session.user.id)
    .single()
  
  if (!profile?.is_superadmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    { count: totalUsers },
    { count: totalImages },
    { count: totalCaptions },
    { count: publicImages },
    { data: topCreators },
    { data: recentActivity },
    { data: likeStats }
  ] = await Promise.all([
    supabaseClient.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseClient.from('images').select('*', { count: 'exact', head: true }),
    supabaseClient.from('captions').select('*', { count: 'exact', head: true }),
    supabaseClient.from('images').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabaseClient.from('images').select('profile_id').then(res => {
      const counts = res.data?.reduce((acc: any, img: any) => {
        acc[img.profile_id] = (acc[img.profile_id] || 0) + 1
        return acc
      }, {})
      return { data: Object.entries(counts || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5) }
    }),
    supabaseClient.from('images').select('created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(10),
    supabaseClient.from('captions').select('like_count').order('like_count', { ascending: false }).limit(100)
  ])

  const avgLikes = (likeStats?.reduce((sum, c) => sum + (c.like_count || 0), 0) || 0) / (likeStats?.length || 1)

  return NextResponse.json({
    totalUsers,
    totalImages,
    totalCaptions,
    publicImages,
    topCreators,
    recentActivity: recentActivity?.length || 0,
    avgLikes: Math.round(avgLikes)
  })
}
