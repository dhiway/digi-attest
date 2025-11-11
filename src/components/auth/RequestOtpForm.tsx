import { useMutation } from '@tanstack/react-query'
import { requestOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { z } from 'zod/v4'
import { toast } from 'sonner'

interface Props {
  setHasUser: (v: boolean) => void
  setEmail: (email: string) => void
}

const emailSchema = z.object({
  email: z.email("Invalid email format please enter valid email ID"),
})


export function RequestOtpForm({ setHasUser, setEmail }: Props) {
  const [email, setLocalEmail] = useState('')
  const [error, setError] = useState('')
  const [otpError, setOtpError] = useState('')

  const mutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      setHasUser(data.user)
      setEmail(email)
    },
    onError: (err) => {
      setOtpError(err.message)
      toast.error(`Error sending OTP: ${err.message}`)
    }
  })

  function handleSubmit() {
    const result = emailSchema.safeParse({ email })
    setError("")
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    mutation.mutate(email)
  }

  return (
    // <div className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-white shadow-xl border border-gray-200 backdrop-blur-md">

    <div className="w-full  max-w-sm sm:max-w-md md:max-w-lg   border border-black-200  shadow-2xl  backdrop-blur-md  p-6 rounded-xl space-y-4 ">
      <div className='space-y-4 '>

        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Enter your email to receive a one-time password
          </p>
        </div>
        {/* <label className='text-sm font-medium text-foreground '> Enter Email</label> */}
        <Input
          type="email"
          placeholder="Enter your Email ID"
          value={email}
          onKeyDown={(e) => e.key == 'Enter' && handleSubmit()}
          onChange={(e) => {
            setLocalEmail(e.target.value)
            setError("")
            setOtpError("")
          }}
        />


        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!email || mutation.isPending}
        >
          {mutation.isPending ? 'Sending...' : 'Request OTP'}
        </Button>
      </div>

      <div className='transparent flex flex-col gap-4'>

        {error && <p className="text-red-500 text-sm text-center border p-3 rounded-xl">{error}</p>}
        {otpError && <p className='text-red-500 text-sm text-center border p-3 rounded-xl'> {otpError}</p>}




      </div>
    </div>
  )
}
