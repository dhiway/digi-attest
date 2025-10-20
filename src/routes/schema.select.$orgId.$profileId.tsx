import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { useQuery, useMutation } from '@tanstack/react-query'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select'
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
import { getSchemas, createSchema, type CreateSchemaResponse } from '@/lib/api'

export const Route = createFileRoute('/schema/select/$orgId/$profileId')({
  component: RouteComponent,
})

type CredentialSchemaInput = z.infer<typeof credentialSchemaSchema>

function RouteComponent() {
  const navigate = useNavigate()
  const { setCredentialSchema, name, url, body } = useCredentialSchemaStore()
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const { profileId, orgId } = useParams({ from: '/schema/select/$orgId/$profileId' })

  const { data: schemas = [], isLoading, refetch } = useQuery({
    queryKey: ['schemas'],
    queryFn: getSchemas,
  })

  const createMutation = useMutation({
    mutationFn: createSchema,
    onSuccess: async (newSchema: CreateSchemaResponse) => {
      console.log(newSchema)
      refetch()
      setCredentialSchema({ name: newSchema.name, url: newSchema.url || '', body: newSchema.body, new: true })
      setIsCreatingNew(false)
      form.reset()
    },
    onError: (err) => {
      console.log("mutation error: ", err)
    }
  })

  const form = useForm<CredentialSchemaInput>({
    resolver: zodResolver(credentialSchemaSchema.omit({ new: true })),
    defaultValues: {
      name: undefined,
      url: undefined,
      body: undefined,
    },
  })

  const handleSelect = (schemaName: string) => {
    // the schemaName uuid is used to control add new schema button
    if (schemaName === 'c7e6aaaa-07cb-4e99-bc6e-76cb84332fe8') {
      clearUI()
      setIsCreatingNew(true)
    }
    const selected = schemas.find((s: any) => s.name === schemaName)
    if (selected) {
      setCredentialSchema({
        name: selected.name,
        url: selected.url || '',
        body: selected.body,
        new: false,
      })
    }
  }

  const clearUI = () => {
    setCredentialSchema({
      name: "",
      url: '',
      body: '',
      new: false,
    })

  }

  const handleCreateNew = (data: CredentialSchemaInput) => {
    try {
      let body = data.body
      let url = typeof data.url === 'string' && data.url.trim().length > 0 ? data.url.trim() : ''

      if (typeof body !== 'object' && !url) {
        if (body.trim().length === 0) {
          return console.error('Invalid schema body and missing Url')
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
    } catch (err: any) { console.error("schema create error: ", err.message) }
  }

  if (isLoading)
    return (
      <section className="main-container flex justify-center items-center">
        <p>Loading schemas...</p>
      </section>
    )

  return (
    <section className="main-container px-4 py-8 flex flex-col">
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <Select disabled={isCreatingNew} onValueChange={handleSelect} value={name}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Schema" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {schemas.map((schema: any) => (
              <SelectItem key={schema.name} value={schema.name}>
                {schema.name}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem
              className="capitalize"
              key="c7e6aaaa-07cb-4e99-bc6e-76cb84332fe8"
              value="c7e6aaaa-07cb-4e99-bc6e-76cb84332fe8"
            >
              + Add New Schema
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Form to create new schema */}
        {isCreatingNew && (
          <div className="space-y-4 border rounded-xl p-4 bg-muted/20 overflow-auto flex-1 min-h-0">
            <h2 className="font-semibold text-lg">Create New Schema</h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateNew)}
                className="space-y-4 flex flex-col"
              >
                {/* Schema Name */}
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

                {/* Schema URL */}
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
                {/* Schema JSON Body */}
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-0">
                      <FormLabel>Schema JSON Body</FormLabel>
                      <FormControl>
                        <Textarea
                          className="select-text h-[250px]"
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

                {/* Buttons */}
                <div className="flex gap-2 justify-end mt-8">
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

        {/* Schema Preview */}
        {!isCreatingNew && (name || url || Object.keys(body ?? {}).length > 0) ? (
          <div className="flex flex-col flex-1 min-h-0">
            <h3 className="font-semibold text-lg mb-2">Schema Preview</h3>
            <div className="flex-1 min-h-0">
              <pre className="h-full p-3 rounded-md bg-muted text-sm overflow-auto">
                {JSON.stringify({ name, url, body }, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      </div>

      {/* Sticky footer area */}
      {!isCreatingNew && (
        <div className="pt-4">
          <Button
            disabled={name.length < 3}
            className="w-full"
            onClick={() =>
              navigate({ to: `/credential/capture/${orgId}/${profileId}` })
            }
          >
            Continue
          </Button>
        </div>
      )}
    </section>
  )

}
