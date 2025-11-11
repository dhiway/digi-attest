import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { verifyOtp, requestOtp } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/user'
import { useNavigate } from '@tanstack/react-router'
import { CiCircleChevLeft } from 'react-icons/ci'
import { toast } from 'sonner'

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
      if (err?.response?.status === 400) {
        toast.error("Enter Valid OTP");
        //console.log('The OTP is not valid')
      } else if (err.message.includes('Network Error')) {
        toast.error('There is some issue with server')
      }
      // alert(err.response?.data?.message || 'Something went wrong')
    },
  })

  // Resend mutation using the same requestOtp function
  const resendMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: () => {
      //  alert('OTP has been resent to your email!')
      toast.message("The OTP has sent to your mail ID")
      setCounter(60)
      setIsDisabled(true)
      setOtp('')

    },
    onError: (err: any) => {
      //alert(err.response?.data?.message || 'Failed to resend OTP')
      toast.error(err.message)
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

  //handles Resend OTP request through same requestotp api 
  //if we have to limit the resend we need another  api.
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
    <div className="w-full  max-w-sm sm:max-w-md md:max-w-lg   border border-black-200  shadow-2xl  backdrop-blur-md  p-6 rounded-xl space-y-4 ">

      <h2 className="text-2xl font-bold text-center ">
        {hasUser ? 'Sign In' : 'Sign Up'}
      </h2>

      <p className="text-center text-gray-700 whitespace-nowrap text-sm md:text-base lg:text-lg">
        The OTP has sent to <span className="font-medium">{email}</span>
      </p>

      {!hasUser && (
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <Input
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className="flex  sm:flex-row flex-col gap-3 pt-2">
        <Button onClick={() => setHasUser(null)} className="w-12 " disabled={verifyMutation.isPending}>
          <CiCircleChevLeft size={22} />
        </Button>

        <Button className="flex-1" onClick={handleSubmit} disabled={verifyMutation.isPending}>
          {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button className="flex-1" onClick={handleResendOtp} disabled={verifyMutation.isPending || resendMutation.isPending || isDisabled}>
          {resendMutation.isPending ? 'Sending...' :
            isDisabled ? `Resend ${counter}s` : 'Resend OTP'}
        </Button>
      </div>

      <div>
        {(verifyMutation.isError || resendMutation.isError) && (
          <p className=" text-muted-foreground border rounded-sm p-3 text-red-500 text-sm md:text-base lg:text-lg text-center mt-1">
            The entered OTP is not valid
          </p>
        )}
      </div>


    </div>

  );
}


//what all things i can improve :
// make the otp limit to 6 digits last
// and automatically handle the submit if the user enters 6 digits 