import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { credentialSchemaSchema, useCredentialSchemaStore } from '@/store/credential'
import { getSchemas, createSchema } from '@/lib/api'

export const Route = createFileRoute('/schema/select/$orgId/$profileId')({
  component: RouteComponent,
})

type CredentialSchemaInput = z.infer<typeof credentialSchemaSchema>

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setCredentialSchema, name, url, body } = useCredentialSchemaStore()
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  // ✅ Fetch all schemas
  const { data: schemas = [], isLoading } = useQuery({
    queryKey: ['schemas'],
    queryFn: getSchemas,
  })

  // ✅ Create schema mutation
  const createMutation = useMutation({
    mutationFn: createSchema,
    onSuccess: (newSchema) => {
      queryClient.setQueryData(['schemas'], (old: any) => [...(old || []), newSchema])
      setCredentialSchema({ ...newSchema, new: true })
      setIsCreatingNew(false)
      form.reset()
    },
  })

  const form = useForm<CredentialSchemaInput>({
    resolver: zodResolver(credentialSchemaSchema.omit({ new: true })),
    defaultValues: {
      name: '',
      url: undefined,
      body: {},
    },
  })

  const handleSelect = (schemaName: string) => {
    const selected = schemas.find((s: any) => s.name === schemaName)
    if (selected) {
      setCredentialSchema({
        name: selected.name,
        url: selected.url || undefined,
        body: selected.body,
        new: false,
      })
    }
  }

  const handleCreateNew = (data: CredentialSchemaInput) => {
    try {
      let body = data.body
      let url = typeof data.url === 'string' && data.url.trim().length > 0 ? data.url.trim() : undefined

      if (typeof body !== 'object' && typeof body === "string" && !url) {
        if (body.trim().length === 0) {
          throw Error('Invalid body and Missing Url')
        }
        body = JSON.parse(body)
      }
      createMutation.mutate({
        name: data.name,
        description: data.name,
        version: '1.0.0',
        body: body,
        url: url,
      })
    } catch (err: any) { console.error(err.message) }
  }

  if (isLoading)
    return (
      <section className="main-container flex justify-center items-center">
        <p>Loading schemas...</p>
      </section>
    )

  return (
    <section className="main-container px-4 space-y-6 flex flex-col">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Schema" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {schemas.map((schema: any) => (
            <SelectItem key={schema.name} value={schema.name}>
              {schema.name}
            </SelectItem>
          ))}
          <div className="border-t my-1" />
          <div className="px-2 py-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsCreatingNew(true)}
            >
              + Add New Schema
            </Button>
          </div>
        </SelectContent>
      </Select>

      {/* Form to create new schema */}
      {isCreatingNew && (
        <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
          <h2 className="font-semibold text-lg">Create New Schema</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateNew)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schema Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter schema name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schema URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schema JSON Body</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter valid JSON schema"
                        rows={8}
                        value={
                          typeof field.value === 'string'
                            ? field.value
                            : JSON.stringify(field.value, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            field.onChange(parsed)
                          } catch {
                            field.onChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreatingNew(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Preview */}
      {((name || url || Object.keys(body ?? {}).length > 0) && !isCreatingNew) ? (
        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg">Schema Preview</h3>
          <pre className="p-3 rounded-md bg-muted text-sm overflow-auto max-h-[400px]">
            {JSON.stringify({ name, url, body }, null, 2)}
          </pre>
        </div>
      ) : <></>}

      <div className="flex justify-center mb-8">
        <Button
          className="mt-2 w-full"
          onClick={() => navigate({ to: '/credential/capture' })}
        >
          Continue
        </Button>
      </div>
    </section>
  )
}
