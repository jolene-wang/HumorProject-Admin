import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('email', user.email)
        .single()

      if (!profile?.is_superadmin) {
        return false
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, is_superadmin')
          .eq('email', session.user.email)
          .single()
        
        session.user.profileId = profile?.id
        session.user.isSuperadmin = profile?.is_superadmin
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
