import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { verifyOtp, requestOtp } from '@/lib/api'
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
  const [counter, setCounter] = useState(60)
  const [isDisabled, setIsDisabled] = useState(true)


  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("The server resonse data is:", data)
      setUser({ ...data.user, token: data.token })
      navigate({ to: '/organization/list' })

    },
    onError: (err: any) => {
      console.log(err.message)
      // alert(err.response?.data?.message || 'Something went wrong')
    },
  })

  // Resend mutation using the same requestOtp function
  const resendMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: () => {
      //  alert('OTP has been resent to your email!')
      setCounter(60)
      setIsDisabled(true)

    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to resend OTP')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyMutation.mutate({
      name: hasUser ? undefined : name,
      email,
      otp,
      createAdmin: false,
    })
  }

  const handleResendOtp = () => {
    resendMutation.mutate(email)
    console.log(resendMutation.mutate(email))
  }

  useEffect(() => {
    let timer: number | undefined;
    if (isDisabled && counter > 0) {
      timer = window.setInterval(() => {
        setCounter((prev) => (prev - 1))
      }, 1000);
    }

    if (counter === 0) {
      setIsDisabled(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isDisabled, counter])

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

      <div className='flex justify-center gap-4 w-full' >
        <Button
          onClick={() => setHasUser(null)}
          className="w-max"
          disabled={verifyMutation.isPending}
        >
          <CiCircleChevLeft size={24} />
        </Button>
        <Button className="w-3/9" onClick={handleSubmit} disabled={verifyMutation.isPending}>
          {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>
        <Button className="w-3/9" onClick={handleResendOtp} disabled={verifyMutation.isPending || resendMutation.isPending || isDisabled}>
          {resendMutation.isPending ? (
            <div>sending...</div>
          ) : isDisabled ? `Resend OTP ${counter}(s)`
            :
            'Resend OTP'
          }
        </Button>
        <div>
        </div>

      </div>
      <div>
        {(verifyMutation.isError || resendMutation.isError) && (
          <p className="text-red-500 text-sm flex justify-center" >The entered OTP is not valid</p>
        )}
      </div>
    </div >
  )
}
