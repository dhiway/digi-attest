import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { verifyOtp } from '@/lib/api'
import { requestOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/user'
import { useNavigate } from '@tanstack/react-router'
import { CiCircleChevLeft } from 'react-icons/ci'
import { useResendTimer } from '@/hooks/useResendTimer'
import { toast } from 'sonner'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'

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
  const { secondsLeft, isActive, resetTimer } = useResendTimer(30)

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setUser({ ...data.user, token: data.token })
      navigate({ to: '/organization/list' })
      resetTimer()
    },
    onError: (err: any) => {
      resetTimer()
      toast.error(err.response?.data?.message || 'Something went wrong')
    },
  })

  const ResendOtpMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: () => {
      resetTimer()
      toast.message(`Otp resent to ${email}`)
    },
    onError: (error) => {
      resetTimer()
      toast.error(error.message || `Failed to send Otp`)
    }
  })

  const handleSubmit = async () => {
    mutation.mutate({
      name: hasUser ? undefined : name,
      email,
      otp,
      rememberMe: true,
      createAdmin: false,
    })
  }

  return (
    <div className="w-full max-w-sm space-y-4 p-6 flex flex-col rounded-lg border">
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
      <div className='flex justify-center items-center w-full'>
        <InputOTP value={otp}
          onChange={(e) => setOtp(e)}
          maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

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
      <div className='flex justify-between items-center'>
        <p className={!isActive ? 'invisible' : ''}>Resend Otp in {secondsLeft} sec</p>
        <Button onClick={() => ResendOtpMutation.mutate(email)}
          variant={'link'} disabled={isActive}> Resend Otp </Button>
      </div>
    </div>
  )
}
