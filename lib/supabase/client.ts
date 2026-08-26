import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['NEXT_PUBLIC_SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

let _supabase: ReturnType<typeof createClient> | undefined;

// Exporting a singleton instance for client-side usage to avoid re-creating the client on every render
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
