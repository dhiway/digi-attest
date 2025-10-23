import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { createCredential, type CredentialRequest } from '@/lib/api/credential'
import { toast } from 'sonner'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export const Route = createFileRoute('/credential/create/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/create/$orgId/$profileId' })
  const { body } = useCredentialSchemaStore()
  const { key: credentialImageKey, photo } = useCredentialPhotoStore()
  const { id: schemaId, name: schemaName } = useCredentialSchemaStore()
  const navigate = useNavigate()

  if ((!schemaId || schemaId?.length < 10) || orgId?.length > 10) {
    return navigate({ to: '/schema/select/$orgId/$profileId', params: { orgId, profileId } })
  }

  const { setCredential } = useCredentialStore()
  const [loading, setLoading] = useState(false)
  const createCredentialMutation = useMutation({
    mutationFn: async (payload: CredentialRequest) => {
      return await createCredential({ orgId, data: payload })
    },
    onSuccess: (created) => {
      setCredential(created)
      navigate({ to: '/credential/view/$orgId', params: { orgId: orgId } })
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
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center w-full justify-center p-6">
            <ShadCNForm
              schema={body}
              validator={validator}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <img src={photo?.dataUrl} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
