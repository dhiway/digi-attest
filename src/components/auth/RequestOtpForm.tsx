import { useMutation } from '@tanstack/react-query'
import { requestOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(email)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your email to receive a one-time password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                disabled={mutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mutation.isPending || !email}
              size="lg"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending OTP...
                </div>
              ) : (
                'Request OTP'
              )}
            </Button>
          </form>

          {/* Loading State Indicator */}
          {mutation.isPending && (
            <div className="pt-2">
              <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Error State */}
          {mutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">
                Failed to send OTP. Please try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}