import { createFileRoute, useParams } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { createCredential, type Credential } from '@/lib/api/credential'
import { toast } from 'sonner'

export const Route = createFileRoute('/credential/create/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/create/$orgId/$profileId' })
  const { body } = useCredentialSchemaStore()
  const { key: credentialImageKey } = useCredentialPhotoStore()
  const { id: schemaId, name: schemaName } = useCredentialSchemaStore()
  const { setCredential } = useCredentialStore()
  const [loading, setLoading] = useState(false)

  const createCredentialMutation = useMutation({
    mutationFn: async (payload: Credential) => {
      return await createCredential({ orgId, data: payload })
    },
    onSuccess: (created) => {
      setCredential(created)
      toast.success('Credential created successfully')
    },
    onError: (err: any) => {
      console.error('Error creating credential:', err)
      toast.error(err.response?.data?.message || 'Failed to create credential')
    },
  })

  const handleSubmit = async ({ formData }: any) => {
    if (!credentialImageKey) {
      toast.error('Please upload an image before submitting')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: schemaName,
        orgId,
        profileId,
        data: formData,
        schemaId: schemaId!,
        imageUrl: credentialImageKey,
      }

      await createCredentialMutation.mutateAsync(payload)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container max-w-2xl mx-auto py-8 px-4">
      <ShadCNForm
        schema={body}
        validator={validator}
        onSubmit={handleSubmit}
        disabled={loading}
      />
    </div>
  )
}
