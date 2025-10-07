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
''

// Define the schema with zod including the additional fields
const profileSchema = z.object({
  logourl: z.string().url("Invalid URL").or(z.string().length(0)).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
})

type ProfileForm = z.infer<typeof profileSchema>

export const Route = createFileRoute('/profile/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  // Initialize react-hook-form with zod resolver and schema
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
    },
  })

  function onSubmit(data: ProfileForm) {
    console.log("Form Data:", data)
    navigate({ to: '/profile/list' })
    // handle the form submission logic here
  }

  return (
    <div className='h-dvh w-dvw overflow-hidden px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Your birth date.</FormDescription>
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

