import { SupabaseClient } from '@supabase/supabase-js'

export const userRepository = {
  async getUserProfile(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateUserProfile(supabase: SupabaseClient, userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async upsertUserPreferences(supabase: SupabaseClient, userId: string, preferencesData: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferencesData })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
