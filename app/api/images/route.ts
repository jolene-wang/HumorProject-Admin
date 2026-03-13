import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

async function checkSuperadmin() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return { authorized: false, supabase: null }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', session.user.id)
    .single()
  
  return { authorized: profile?.is_superadmin === true, supabase }
}

export async function GET(request: Request) {
  const { authorized, supabase } = await checkSuperadmin()
  if (!authorized || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (id) {
    const { data, error } = await supabase.from('images').select('*').eq('id', id).single()
    return NextResponse.json({ data, error })
  }

  if (from !== null && to !== null) {
    const { data, error, count } = await supabase
      .from('images')
      .select('*', { count: 'exact' })
      .order('created_datetime_utc', { ascending: false })
      .range(parseInt(from), parseInt(to))
    return NextResponse.json({ data, error, count })
  }

  const { data, error } = await supabase.from('images').select('*').order('created_datetime_utc', { ascending: false })
  return NextResponse.json({ data, error })
}

export async function POST(request: Request) {
  const { authorized, supabase } = await checkSuperadmin()
  if (!authorized || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabase.from('images').insert(body).select()
  return NextResponse.json({ data, error })
}

export async function PUT(request: Request) {
  const { authorized, supabase } = await checkSuperadmin()
  if (!authorized || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('images').update(updates).eq('id', id).select()
  return NextResponse.json({ data, error })
}

export async function DELETE(request: Request) {
  const { authorized, supabase } = await checkSuperadmin()
  if (!authorized || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const { error } = await supabase.from('images').delete().eq('id', id)
  return NextResponse.json({ error })
}
