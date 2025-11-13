import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const QueryClient = useQueryClient();

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
      QueryClient.invalidateQueries({
        queryKey: ['list-organizations'],
      })
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
    <section className='min-h-screen flex items-center justify-center relative overflow-hidden '>
      <div className="absolute top-0 left-1/8 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob "></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="absolute bottom-0 left-1/2 w-100 h-100 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
      <div className="flex justify-center px-4 py-8 items-center main-container ">
        <Card className="w-full max-w-96 shadow-md backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
          <CardHeader>
            <CardTitle className=' text-center text-xl text-primary/90'>Create Organization</CardTitle>
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
                {mutation.error &&
                  <div className='flex justify-center border-2 border-dotted border-red-200 rounded-lg p-2 text-red-500 transition'>
                    <p>Failed to create organization </p>
                  </div>

                }
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>

  )
}
