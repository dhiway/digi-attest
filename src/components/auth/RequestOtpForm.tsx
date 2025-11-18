import { useMutation } from '@tanstack/react-query'
import { requestOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  setHasUser: (v: boolean) => void
  setEmail: (email: string) => void
}

export function RequestOtpForm({ setHasUser, setEmail }: Props) {
  const [email, setLocalEmail] = useState('')

  const mutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      setHasUser(data.user)
      setEmail(email)
    },
    onError: (error) => {
      toast.error(error.message || `Failed to send Otp`)
    }
  })

  return (
    <div className="w-full max-w-sm space-y-4 p-6 rounded-lg border">
      <h2 className="text-xl font-semibold text-center">Enter your email</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setLocalEmail(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={() => mutation.mutate(email)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Sending...' : 'Request OTP'}
      </Button>
    </div>
  )
}
