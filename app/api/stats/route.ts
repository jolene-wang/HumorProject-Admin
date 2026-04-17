import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
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
    { data: likeStats },
    { data: ratingStats },
    { data: topRatedCaptions },
    { data: recentRatings }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
    supabase.from('captions').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('images').select('profile_id').then(res => {
      const counts = res.data?.reduce((acc: any, img: any) => {
        acc[img.profile_id] = (acc[img.profile_id] || 0) + 1
        return acc
      }, {})
      return { data: Object.entries(counts || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5) }
    }),
    supabase.from('images').select('created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(10),
    supabase.from('captions').select('like_count').order('like_count', { ascending: false }).limit(100),
    supabase.from('caption_ratings').select('rating').then(res => {
      const ratings = res.data || []
      const totalRatings = ratings.length
      const avgRating = totalRatings > 0 ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings : 0
      const ratingDistribution = ratings.reduce((acc: any, r) => {
        const rating = Math.floor(r.rating || 0)
        acc[rating] = (acc[rating] || 0) + 1
        return acc
      }, {})
      return { data: { totalRatings, avgRating, ratingDistribution } }
    }),
    supabase.from('captions').select('id, content, like_count').order('like_count', { ascending: false }).limit(5),
    supabase.from('caption_ratings').select('rating, created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(10)
  ])

  const avgLikes = (likeStats?.reduce((sum, c) => sum + (c.like_count || 0), 0) || 0) / (likeStats?.length || 1)

  return NextResponse.json({
    totalUsers,
    totalImages,
    totalCaptions,
    publicImages,
    topCreators,
    recentActivity: recentActivity?.length || 0,
    avgLikes: Math.round(avgLikes),
    totalRatings: ratingStats?.totalRatings || 0,
    avgRating: Math.round((ratingStats?.avgRating || 0) * 100) / 100,
    ratingDistribution: ratingStats?.ratingDistribution || {},
    topRatedCaptions: topRatedCaptions || [],
    recentRatings: recentRatings?.length || 0
  })
}
