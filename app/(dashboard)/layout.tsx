import { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Spinner } from '@/components/ui/spinner'
import AuthGuard from '@/components/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthGuard>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </AuthGuard>
    </Suspense>
  )
}
