import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// In a real application, these should be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database functions for the frontend
export const supabaseAPI = {
  // User predictions
  getUserPredictions: async (userEmail, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user predictions:', error)
      return []
    }
  },

  // Dataset information
  getDatasets: async () => {
    try {
      const { data, error } = await supabase
        .from('datasets')
        .select('id, filename, rows, upload_date, uploaded_by')
        .order('upload_date', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching datasets:', error)
      return []
    }
  },

  // Model metadata
  getModelMetadata: async () => {
    try {
      const { data, error } = await supabase
        .from('model_metadata')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (error) throw error
      return data[0] || null
    } catch (error) {
      console.error('Error fetching model metadata:', error)
      return null
    }
  },

  // Real-time subscriptions
  subscribeToPredictions: (userEmail, callback) => {
    return supabase
      .channel('predictions')
      .on('postgres_changes', {
        event: 'INSERT',
        table: 'predictions',
        filter: `user_email=eq.${userEmail}`
      }, callback)
      .subscribe()
  },

  subscribeToDatasets: (callback) => {
    return supabase
      .channel('datasets')
      .on('postgres_changes', {
        event: '*',
        table: 'datasets'
      }, callback)
      .subscribe()
  },

  subscribeToModelMetadata: (callback) => {
    return supabase
      .channel('model_metadata')
      .on('postgres_changes', {
        event: '*',
        table: 'model_metadata'
      }, callback)
      .subscribe()
  }
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your_anon_key_here' &&
         supabaseUrl.includes('supabase.co')
}

export default supabase
