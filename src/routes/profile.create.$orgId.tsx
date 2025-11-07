import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from '@tanstack/react-query'
import { createProfile, type CreateUserProfileInput } from '@/lib/api'
import { z } from 'zod/v3'

export const Route = createFileRoute('/profile/create/$orgId')({
  component: RouteComponent,
})

const ProfileFormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().length(10),
  email: z.string().email()
})

type ProfileForm = z.infer<typeof ProfileFormSchema>

function RouteComponent() {
  const { orgId } = useParams({ from: '/profile/create/$orgId' })
  const navigate = useNavigate()

  const createProfileForUser = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const profileData: CreateUserProfileInput = {
        name: data.name,
        phoneNumber: [data.phoneNumber],
        email: data.email,
        type: 'holder',
        metadata: {},
        orgId: orgId,
        website: null
      }
      return await createProfile(profileData, orgId)
    },
    onSuccess: async () => {
      navigate({ to: `/profile/list/${orgId}` })
    },
    onError: async (err) => {
      console.log(err)
    }
  })

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: '',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Create Profile
          </h2>
          <p className="mt-2 text-amber-600/70">
            Add a new profile to your organization
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-lg p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((e) => createProfileForUser.mutateAsync(e))} className="space-y-6">
              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900 font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          className='pl-14 py-6 border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/50 text-amber-900 placeholder-amber-600/50'
                          type="tel"
                          placeholder="Enter you phoneNumber"
                          {...field}
                        />
                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2'>
                          <span className="text-amber-600 font-medium">+91</span>
                          <div className="w-px h-6 bg-amber-300/50"></div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-rose-600" />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900 font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className='py-6 border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/50 text-amber-900 placeholder-amber-600/50'
                        placeholder="Enter full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-600" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900 font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className='py-6 border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/50 text-amber-900 placeholder-amber-600/50'
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-600" />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 py-6"
                  onClick={() => navigate({ to: `/profile/list/${orgId}` })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 text-white py-6"
                  disabled={createProfileForUser.isPending}
                >
                  {createProfileForUser.isPending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Back to Profiles Link */}
        <div className="text-center">
          <button
            onClick={() => navigate({ to: `/profile/list/${orgId}` })}
            className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profiles
          </button>
        </div>
      </div>
    </div>
  )
} 