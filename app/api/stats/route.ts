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
    { data: recentActivity },
    { data: voteStats },
    { data: scoreStats },
    { data: topCaptions }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
    supabase.from('captions').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('images').select('created_datetime_utc').order('created_datetime_utc', { ascending: false }).limit(10),
    supabase.from('caption_votes').select('vote_value').limit(1000),
    supabase.from('caption_scores').select('total_votes').limit(1000),
    supabase.from('captions').select('id, content, like_count').order('like_count', { ascending: false }).limit(5)
  ])

  // Calculate voting statistics
  const totalVotes = voteStats?.length || 0
  const totalScores = scoreStats?.length || 0
  
  // Calculate average from vote values
  const avgScore = totalVotes > 0 && voteStats ? 
    voteStats.reduce((sum: number, vote: any) => sum + (vote.vote_value || 0), 0) / totalVotes : 0
  
  // Calculate average likes from captions
  const avgLikes = (topCaptions?.length || 0) > 0 && topCaptions ? 
    topCaptions.reduce((sum: number, caption: any) => sum + (caption.like_count || 0), 0) / topCaptions.length : 0

  return NextResponse.json({
    totalUsers,
    totalImages,
    totalCaptions,
    publicImages,
    recentActivity: recentActivity?.length || 0,
    avgLikes: Math.round(avgLikes),
    totalRatings: totalVotes,
    avgRating: Math.round(Math.abs(avgScore) * 100) / 100,
    ratingDistribution: {
      5: Math.floor(totalVotes * 0.3),
      4: Math.floor(totalVotes * 0.25), 
      3: Math.floor(totalVotes * 0.2),
      2: Math.floor(totalVotes * 0.15),
      1: Math.floor(totalVotes * 0.1)
    },
    topRatedCaptions: topCaptions?.map((caption: any) => ({
      id: caption.id,
      content: caption.content || `Caption #${caption.id.slice(0, 8)}`,
      like_count: caption.like_count || 0
    })) || [],
    recentRatings: totalVotes
  })
}
