import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Database } from '@/lib/supabase'

type ServiceProvider = Database['public']['Tables']['service_providers']['Row']
type ServiceProviderInsert = Database['public']['Tables']['service_providers']['Insert']

export function useServiceProviders() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useCreateServiceProvider() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (provider: ServiceProviderInsert) => {
      const { data, error } = await supabase
        .from('service_providers')
        .insert(provider)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-providers'] })
      toast.success('Service provider created successfully')
    },
    onError: (error) => {
      console.error('Error creating service provider:', error)
      toast.error('Failed to create service provider')
    },
  })
}
