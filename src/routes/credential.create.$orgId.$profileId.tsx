import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createCredential, type CredentialRequest } from '@/lib/api/credential'
import { toast } from 'sonner'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { base64ToFile } from '@/lib/utils'
import scribe from 'scribe.js-ocr'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { generateFormData, type OcrExtractedOutput } from '@/lib/ocr-matcher'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/credential/create/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/create/$orgId/$profileId' })
  const [ocrOutput, setOcrOutput] = useState<OcrExtractedOutput | null>(null)
  const { key: credentialImageKey, photo } = useCredentialPhotoStore()
  const { id: schemaId, name: schemaName, body } = useCredentialSchemaStore()
  const navigate = useNavigate()

  async function ocr() {
    try {
      const file = base64ToFile(photo?.base64!, `${profileId}-${Date.now()}`);

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
      await scribe.init({ ocr: true, font: true });
      const text = await scribe.extractText([file]);
      const output = generateFormData(text as string, body)
      console.log(output, text)
      setOcrOutput(output)
    } catch (err) {
      console.error('Error extracting text:', err);
    }
  }
  useEffect(() => {
    if (!ocrOutput) { ocr() }
  }, [])

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
  if (!ocrOutput) {
    return <></>
  }
  return (<>
    <div className="main-container max-w-2xl mx-auto py-8 px-4">
      <ResizablePanelGroup
        direction="vertical"
        className="flex-1 max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={65}>
          <div className="flex h-full items-baseline w-full justify-center p-6 overflow-y-scroll">
            <ShadCNForm
              schema={body}
              validator={validator}
              onSubmit={handleSubmit}
              disabled={loading}
              formData={ocrOutput.formData}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35}>
          <ScrollArea className='bg-background w-96 rounded-md shadow whitespace-nowrap'>
            <div className='flex w-full space-x-6 p-4'>
              {ocrOutput?.extracted && ocrOutput.extracted.map((text: any, i: number) => {
                return (<>
                  <Button variant='ghost' className='w-max' key={text.key + i}>{text.value}</Button>
                </>
                )
              })}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <div className="flex h-full items-baseline justify-center p-6 overflow-scroll">
            <img src={photo?.dataUrl} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </>
  )
}
