import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSession } from '@/lib/api'
import { useUserStore } from '@/store/user'
import { RequestOtpForm } from '@/components/auth/RequestOtpForm'
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm'

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
  })

  useEffect(() => {
    if (data?.user) {
      setUser(data.user)
      navigate({ to: '/profile/list' })
    }
  }, [data])

  if (isLoading) return <p>Loading...</p>

  return (
    <section className="main-container flex justify-center items-center min-h-screen">
      {hasUser === null ? (
        <RequestOtpForm setHasUser={setHasUser} setEmail={setEmail} />
      ) : (
        <VerifyOtpForm hasUser={hasUser} email={email} />
      )}
    </section>
  )
}
