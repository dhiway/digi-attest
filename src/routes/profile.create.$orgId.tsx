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
import { Mutation, useMutation } from '@tanstack/react-query'
import { createProfile, type CreateUserProfileInput } from '@/lib/api'
import { z } from 'zod/v3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient();

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
      toast.message('Profile created successfully')
      queryClient.invalidateQueries({
        queryKey: ['profiles', orgId]
      })
      navigate({ to: `/profile/list/${orgId}` })
    },
    onError: async (err) => {
      toast.error("Couldn't able to create profile")
    }
  })

  // Initialize react-hook-form with zod resolver and schema
  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: '',
    },
  })

  return (
    <section className='min-h-screen flex items-center justify-center relative overflow-hidden '>
      <div className="absolute top-0 left-1/8 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob "></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="absolute bottom-0 left-1/2 w-100 h-100 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="flex justify-center px-4 py-8 items-center main-container ">
        <Card className="w-full max-w-96 shadow-md backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
          <CardHeader>
            <CardTitle className=' text-center text-xl text-primary/90'>Create Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((e) => createProfileForUser.mutateAsync(e))} className="space-y-8  p-1">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl >
                        <div className='relative'>
                          <Input className='pl-12 py-5' type="number" placeholder="9999999999" {...field}
                          />
                          <p className='text-gray-500 pt-[1px] pr-2 flex items-center absolute left-2 top-0 bottom-0 border-r'>+91</p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl >
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-center items-center '>
                  <Button className='items-center w-30' type="submit" disabled={createProfileForUser.isPending} >{
                    createProfileForUser.isPending ? 'Creating...' : 'Save'}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

