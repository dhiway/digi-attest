import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { verifyOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/user'
import { useNavigate } from '@tanstack/react-router'
import { CiCircleChevLeft } from 'react-icons/ci'

interface Props {
  setHasUser: (prop: boolean | null) => void
  hasUser: boolean
  email: string
}

export function VerifyOtpForm({ hasUser, email, setHasUser }: Props) {
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const setUser = useUserStore((s) => s.setUser)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setUser({ ...data.user, token: data.token })
      navigate({ to: '/organization/list' })
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Something went wrong')
    },
  })

  const handleSubmit = () => {
    mutation.mutate({
      name: hasUser ? undefined : name,
      email,
      otp,
      rememberMe: true,
      createAdmin: false,
    })
  }

  return (
    <div className="w-full max-w-sm space-y-4 p-6 rounded-lg border">
      <h2 className="text-xl font-semibold text-center">
        {hasUser ? 'Sign In' : 'Sign Up'}
      </h2>

      {!hasUser && (
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <Input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className='flex justify-end gap-4 w-full ' >
        <Button
          onClick={() => setHasUser(null)}
          className="w-max"
          disabled={mutation.isPending}
        >
          <CiCircleChevLeft size={24} />
        </Button>
        <Button className="w-3/4" onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
    </div>
  )
}
