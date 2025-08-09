import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'

export function useDashboardSummary() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('summaries')

      if (error) throw error
      return data[0] || { homes_count: 0, vehicles_count: 0, unread_notifications_count: 0 }
    },
  })
}
