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

export async function POST(request: Request) {
  const { authorized, supabase } = await checkSuperadmin()
  if (!authorized || !supabase) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    
    return NextResponse.json({ 
      success: true, 
      url: base64,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}