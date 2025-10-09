import { createFileRoute } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export const Route = createFileRoute('/credential/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { body } = useCredentialSchemaStore()
  const { url: imageUrl } = useCredentialPhotoStore()
  const { setCredential } = useCredentialStore()
  const [loading, setLoading] = useState(false)

  const createCredential = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post(`${BASE_URL}/credential/create`, payload, { withCredentials: true })
      return res.data
    },
    onSuccess: (data) => {
      const created = data?.data?.credential
      if (created) {
        setCredential(created)
        /* toast?.success('Credential created successfully') */
      }
    },
    onError: (err: any) => {
      console.error('Error creating credential:', err)
      /* toast?.error(err.response?.data?.message || 'Failed to create credential') */
    },
  })

  const handleSubmit = async ({ formData }: any) => {
    if (!imageUrl) {
      console.log('no image')
      /* toast?.error('Please upload an image before submitting') */
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: 'Aadhar',
        data: formData,
        schemaId: 'fe98f3ab-fee9-4c80-8ea0-6a4e5c70f104',
        imageUrl,
      }

      await createCredential.mutateAsync(payload)
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
