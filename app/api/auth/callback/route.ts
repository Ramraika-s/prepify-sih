import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // The role passed from the frontend (student, institute, mentor)
  const requestedRole = searchParams.get('role') || 'student'
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? `/dashboard/${requestedRole}`

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // If this is a new signup or the user wants to login as a specific role,
      // ensure their user_metadata.role matches the requested role.
      // In a strict prod environment, you might only do this on first signup
      // or verify they are allowed to assume this role.
      
      const currentRole = data.user.app_metadata?.role || data.user.user_metadata?.role;
      
      // If no role is set, set it now.
      if (!currentRole || currentRole !== requestedRole) {
        await supabase.auth.updateUser({
          data: { role: requestedRole }
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`)
}
