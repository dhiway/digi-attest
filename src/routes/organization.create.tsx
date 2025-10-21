import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { createOrganization } from '@/lib/api/organization'

const createOrgSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, alphanumeric, and hyphenated'),
})

type CreateOrgForm = z.infer<typeof createOrgSchema>

export const Route = createFileRoute('/organization/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const form = useForm<CreateOrgForm>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      toast.success('Organization created successfully!')
      navigate({ to: `/organization/list` })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create organization')
    },
  })

  const onSubmit = (values: CreateOrgForm) => {
    mutation.mutate(values)
  }

  return (
    <div className="flex justify-center px-4 py-8 items-center main-container">
      <Card className="w-full max-w-96 shadow-md">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="organization-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
