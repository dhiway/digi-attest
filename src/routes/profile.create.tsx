import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod/v3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from '@tanstack/react-query'
import { createProfile } from '@/lib/api'

// Define the schema with zod including the additional fields
const profileSchema = z.object({
  logourl: z.string().url("Invalid URL").or(z.string().length(0)).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
})

type ProfileForm = z.infer<typeof profileSchema>

export const Route = createFileRoute('/profile/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const createProfileForUser = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const profileBody = {
        type: "holder",
        orgId: "00d437f0-c57c-4647-a89d-a96668315f38",
        metadata: {
          name: data.name,
          logo: data.logourl
        },
        contact: {
          tag: data.email,
          email: data.email,
          phoneNumber: ["9999999999"]
        }
      }
      return await createProfile(profileBody as any)
    },
    onSuccess: async () => {
      navigate({ to: '/profile/list' })
    },
    onError: async (err) => {
      console.log(err)
    }
  })

  // Initialize react-hook-form with zod resolver and schema
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  return (
    <div className='main-container overflow-hidden px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => createProfileForUser.mutateAsync(e))} className="space-y-8">
          <FormField
            control={form.control}
            name="logourl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormDescription>Provide a URL to your logo image.</FormDescription>
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
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormDescription>Your full name.</FormDescription>
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
                <FormDescription>We'll never share your email.</FormDescription>
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

