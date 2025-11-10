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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Create Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900 font-semibold">Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/50 text-amber-900 placeholder-amber-600/50"
                        placeholder="Enter organization name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900 font-semibold">Slug</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6 border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/50 text-amber-900 placeholder-amber-600/50"
                        placeholder="organization-slug"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-600" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 py-6"
                  onClick={() => navigate({ to: `/organization/list` })}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 text-white py-6"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Organization"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}