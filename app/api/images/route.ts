import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabase as supabaseClient } from '@/lib/supabase'

async function checkSuperadmin() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return false
  
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('is_superadmin')
    .eq('id', session.user.id)
    .single()
  
  return profile?.is_superadmin === true
}

export async function GET(request: Request) {
  if (!await checkSuperadmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const { data, error } = await supabaseClient.from('images').select('*').eq('id', id).single()
    return NextResponse.json({ data, error })
  }

  const { data, error } = await supabaseClient.from('images').select('*').order('created_datetime_utc', { ascending: false })
  return NextResponse.json({ data, error })
}

export async function POST(request: Request) {
  if (!await checkSuperadmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabaseClient.from('images').insert(body).select()
  return NextResponse.json({ data, error })
}

export async function PUT(request: Request) {
  if (!await checkSuperadmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabaseClient.from('images').update(updates).eq('id', id).select()
  return NextResponse.json({ data, error })
}

export async function DELETE(request: Request) {
  if (!await checkSuperadmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const { error } = await supabaseClient.from('images').delete().eq('id', id)
  return NextResponse.json({ error })
}
