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
      setUser({ ...data.user, token: data.token })
      navigate({ to: '/organization/list' })
    },
    onError: (err: any) => {
      console.log(err.message)
      alert(err.response?.data?.message || 'Something went wrong')
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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {hasUser ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
              Enter the OTP sent to <span className="font-medium text-foreground break-all">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {!hasUser && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required={!hasUser}
                  disabled={verifyMutation.isPending}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-foreground">
                One-Time Password
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-10 sm:h-11 text-sm sm:text-base text-center tracking-widest transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                disabled={verifyMutation.isPending}
                maxLength={6}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button
                type="button"
                onClick={() => setHasUser(null)}
                className="flex items-center justify-center gap-2 px-4 transition-all duration-200 hover:shadow-md order-2 sm:order-1"
                variant="outline"
                disabled={verifyMutation.isPending || resendMutation.isPending}
                size="lg"
              >
                <CiCircleChevLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2 flex-1">
                <Button
                  type="submit"
                  className="h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  disabled={verifyMutation.isPending || resendMutation.isPending || !otp || (!hasUser && !name)}
                  size="lg"
                >
                  {verifyMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleResendOtp}
                  className="h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  disabled={verifyMutation.isPending || resendMutation.isPending || isDisabled}
                  variant="outline"
                  size="lg"
                >
                  {resendMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Sending...</span>
                    </div>
                  ) : isDisabled ? (   //waits for 60 sec and then again calls resend otp
                    `Resend OTP (${counter}s)`
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {(verifyMutation.isPending || resendMutation.isPending) && (
            <div className="pt-2">
              <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {verifyMutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-xs sm:text-sm text-center">
                Invalid OTP. Please try again.
              </p>
            </div>
          )}

          {resendMutation.isSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-600 text-xs sm:text-sm text-center">
                OTP has been resent successfully!
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted/30 px-4 sm:px-6 py-3 sm:py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Didn't receive OTP? Check your spam folder or request again
          </p>
        </div>
      </div>
    </div>
  )
} 