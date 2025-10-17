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
    <div className='main-container overflow-hidden px-4 py-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => createProfileForUser.mutateAsync(e))} className="space-y-8">
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
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  )
}

