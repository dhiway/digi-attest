import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSession } from '@/lib/api'
import { useUserStore } from '@/store/user'
import { RequestOtpForm } from '@/components/auth/RequestOtpForm'
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm'
import SuspenseLoader from '@/components/SuspenseLoader'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const setUser = useUserStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [hasUser, setHasUser] = useState<boolean | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,

  })

  useEffect(() => {
    if (data?.user) {
      setUser(data.user)
      navigate({ to: '/organization/list', replace: true })
    }
  }, [data])

  if (isLoading) return <SuspenseLoader message='Syncing' />
  return (
    <section className="main-container flex justify-center items-center min-h-screen bg-gradient-to-br from-stone-100 via-orange-50 to-amber-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      {hasUser === null ? (
        <RequestOtpForm setHasUser={setHasUser} setEmail={setEmail} />
      ) : (
        <VerifyOtpForm setHasUser={setHasUser} hasUser={hasUser} email={email} />
      )}
    </section>
  )
}
