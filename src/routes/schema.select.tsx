import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'

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
import AadharSchema from '@/static/json-schemas/aadhar.json'
import { credentialSchemaSchema, useCredentialSchemaStore } from '@/store/credential'

export const Route = createFileRoute('/schema/select')({
  component: RouteComponent,
})

type CredentialSchemaInput = z.infer<typeof credentialSchemaSchema>

function RouteComponent() {
  const navigate = useNavigate()
  const { setCredentialSchema, name, url, body } = useCredentialSchemaStore()
  const [schemas, setSchemas] = useState<
    { name: string; url: string | undefined; body: object }[]
  >([{ name: 'Aadhaar', url: undefined, body: AadharSchema }])
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  const form = useForm<CredentialSchemaInput>({
    resolver: zodResolver(
      credentialSchemaSchema.omit({ new: true }) // new is managed internally
    ),
    defaultValues: {
      name: '',
      url: undefined,
      body: {},
    },
  })

  const handleSelect = (schemaName: string) => {
    const selected = schemas.find((s) => s.name === schemaName)
    if (selected) {
      setCredentialSchema({
        name: selected.name,
        url: selected.url,
        body: selected.body,
        new: false,
      })
    }
  }

  const handleCreateNew = (data: CredentialSchemaInput) => {
    const newSchemaObj = {
      name: data.name,
      url: data.url,
      body: data.body,
    }

    setSchemas((prev) => [...prev, newSchemaObj])
    setCredentialSchema({ ...newSchemaObj, new: true })
    setIsCreatingNew(false)
    form.reset()
  }

  return (
    <section className="main-container px-4 space-y-6 flex flex-col">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Schema" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {schemas.map((schema) => (
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

      {isCreatingNew && (
        <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
          <h2 className="font-semibold text-lg">Create New Schema</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateNew)}
              className="space-y-4"
            >
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
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Schema Preview */}
      {(name || url || Object.keys(body ?? {}).length > 0) && (
        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg">Schema Preview</h3>
          <pre className="p-3 rounded-md bg-muted text-sm overflow-auto max-h-[400px]">
            {JSON.stringify({ name, url, body }, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <Button className="mt-2 w-full" onClick={() => navigate({ 'to': '/credential/capture' })}>Continue</Button>
      </div>
    </section>
  )
}
