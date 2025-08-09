import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </div>
  )
}
