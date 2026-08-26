import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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
    
    if (error) {
      console.error("[Auth Callback] Error exchanging code for session:", error);
    }
    
    if (!error && data.user) {
      // If this is a new signup or the user wants to login as a specific role,
      // ensure their user_metadata.role matches the requested role.
      const currentRole = data.user.app_metadata?.role || data.user.user_metadata?.role;
      
      // If no role is set, set it now.
      if (!currentRole || currentRole !== requestedRole) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: requestedRole }
        });
        if (updateError) {
          console.error("[Auth Callback] Error updating user role:", updateError);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl = `${origin}${next}`
      if (!isLocalEnv && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      }
      
      const response = NextResponse.redirect(redirectUrl);
      
      // Explicitly copy cookies to the redirect response to avoid Next.js bugs
      // where cookieStore modifications don't apply to returned NextResponses.
      const cookieStore = await cookies();
      cookieStore.getAll().forEach((cookie: { name: string, value: string, [key: string]: any }) => {
        response.cookies.set(cookie.name, cookie.value, cookie);
      });

      return response;
    }
  } else {
    const errorDesc = searchParams.get('error_description') || searchParams.get('error');
    if (errorDesc) {
      console.error("[Auth Callback] OAuth Error:", errorDesc);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`)
}
