import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Ensure a Clerk user exists in the Supabase `users` table.
 * Call this after sign-in to sync user data.
 */
export async function ensureUser(clerkUser) {
  if (!supabase || !clerkUser) return null;

  try {
    const userData = {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      name: clerkUser.fullName || clerkUser.firstName || 'User',
      avatar_url: clerkUser.imageUrl || null,
    };

    // Try upsert first
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Supabase user sync skipped:', error.message || error.code || JSON.stringify(error));
      // Don't block the app if user sync fails — the dashboard still works
      return null;
    }
    return data;
  } catch (err) {
    console.warn('ensureUser caught error:', err.message);
    return null;
  }
}
