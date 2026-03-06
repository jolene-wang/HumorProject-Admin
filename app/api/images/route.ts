import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const { data, error } = await supabase.from('images').select('*').eq('id', id).single()
    return NextResponse.json({ data, error })
  }

  const { data, error } = await supabase.from('images').select('*').order('created_datetime_utc', { ascending: false })
  return NextResponse.json({ data, error })
}

export async function POST(request: Request) {

  const body = await request.json()
  const { data, error } = await supabase.from('images').insert(body).select()
  return NextResponse.json({ data, error })
}

export async function PUT(request: Request) {

  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('images').update(updates).eq('id', id).select()
  return NextResponse.json({ data, error })
}

export async function DELETE(request: Request) {

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const { error } = await supabase.from('images').delete().eq('id', id)
  return NextResponse.json({ error })
}
